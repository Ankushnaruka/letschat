const path = require('path');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const Room = require('../models/roomSchema');
const Message = require('../models/messageSchema');
const User = require('../models/userSchema');
const { publisher, subscriber } = require('../config/redis');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const clients = new Map();
let redisSubscriptionsBound = false;
let redisSubscriptionsReady = false;
let messagesSubscriptionAdded = false;
let logoutSubscriptionAdded = false;
let redisSubscriptionSetupPromise = null;

const onRedisMessage = (raw) => handleRedisMessage('messages', raw);
const onRedisForceLogout = (raw) => handleRedisMessage('force-logout', raw);

function broadcastLocally(roomMembers, payload) {
  for (const [client, clientUserId] of clients.entries()) {
    if (roomMembers.includes(clientUserId.toString()) && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  }
}

function handleRedisMessage(channel, raw) {
  try {
    if (channel === 'messages') {
      const parsed = JSON.parse(raw);
      const roomMembers = parsed.roomMembers || [];
      console.info('Redis room message received:', { roomID: parsed.payload?.roomID });
      broadcastLocally(roomMembers, parsed.payload);
      return;
    }

    if (channel === 'force-logout') {
      const { userId } = JSON.parse(raw);
      for (const [client, clientUserId] of clients.entries()) {
        if (clientUserId && clientUserId.toString() === userId.toString()) {
          try {
            if (client.readyState === WebSocket.OPEN) client.close(4003, 'Logged out');
          } catch (err) {
            console.error('Error closing client during force-logout:', err.message);
          }
          clients.delete(client);
        }
      }
    }
  } catch (err) {
    console.error(`Invalid Redis pub/sub message on ${channel}:`, err.message);
  }
}

async function subscribeToRedis() {
  if (!subscriber || !subscriber.isReady || redisSubscriptionsReady) return;
  if (redisSubscriptionSetupPromise) return redisSubscriptionSetupPromise;

  redisSubscriptionSetupPromise = (async () => {
    try {
      // node-redis restores active subscriptions on reconnect; don't register
      // duplicate listeners when its ready event fires again.
      if (messagesSubscriptionAdded && logoutSubscriptionAdded) {
        redisSubscriptionsReady = true;
        console.log('Redis subscriptions restored: messages, force-logout');
        return;
      }

      if (!messagesSubscriptionAdded) {
        await subscriber.subscribe('messages', onRedisMessage);
        messagesSubscriptionAdded = true;
      }
      if (!logoutSubscriptionAdded) {
        await subscriber.subscribe('force-logout', onRedisForceLogout);
        logoutSubscriptionAdded = true;
      }
      redisSubscriptionsReady = true;
      console.log('Redis subscriptions active: messages, force-logout');
    } catch (err) {
      console.warn('Redis subscriptions unavailable; using local room broadcasts:', err.message);
    } finally {
      redisSubscriptionSetupPromise = null;
    }
  })();

  return redisSubscriptionSetupPromise;
}

async function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  if (subscriber && typeof subscriber.subscribe === 'function' && !redisSubscriptionsBound) {
    redisSubscriptionsBound = true;
    subscriber.on('ready', subscribeToRedis);
    const markSubscriberUnavailable = () => {
      redisSubscriptionsReady = false;
      console.warn('Redis subscriber disconnected; room broadcasts will use local fallback');
    };
    subscriber.on('reconnecting', markSubscriberUnavailable);
    subscriber.on('end', markSubscriberUnavailable);
    await subscribeToRedis();
  }

  wss.on('connection', (ws, req) => {
    //Extract token from query string or Authorization header
    const params = new URLSearchParams(req.url ? req.url.split('?')[1] : '');
    const tokenFromQuery = params.get('token');
    const authHeader = req.headers['authorization'];
    const tokenFromHeader = authHeader?.split(' ')[1];
    
    const token = tokenFromQuery || tokenFromHeader;

    if (!token) {
      ws.close(4001, 'Authentication required');
      return;
    }

    let userId;
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      userId = payload._id;
      ws.userId = userId;
      clients.set(ws, userId);
      ws.send(JSON.stringify({ type: 'connected', userId }));
    } catch (err) {
      ws.close(4002, 'Invalid token');
      return;
    }

    ws.on('message', async function incoming(message) {
      let msg;
      try {
        msg = JSON.parse(message);
      } catch (e) {
        msg = { text: message.toString() };
      }
      msg.time = new Date().toISOString();
      msg.sender = ws.userId;

      const room = await Room.findById(msg.roomID);
      if (!room) {
        msg.error = 'Room does not exist';
        ws.send(JSON.stringify(msg));
        return;
      }
      const clientsInRoom = room.members.map(id => id.toString());

      if (!clientsInRoom.includes(ws.userId.toString())) {
        msg.error = 'You are not a member of this room';
        ws.send(JSON.stringify(msg));
        return;
      }
      // Save the message to the database
      try {
        const newMessage = new Message({
          sender: ws.userId,
          room: msg.roomID,
          text: msg.text,
          media: msg.media || null,
        });
        const savedMessage = await newMessage.save();
        const senderUser = await User.findById(ws.userId).select('username');

        // Include message metadata in the broadcast
        const broadcastMsg = {
          _id: savedMessage._id,
          sender: ws.userId,
          senderUsername: senderUser ? senderUser.username : 'Unknown',
          roomID: msg.roomID,
          text: msg.text,
          time: savedMessage.createdAt,
          media: msg.media || null,
        };

        // Publish to Redis for all server instances; if Redis is down, broadcast locally
        const pubPacket = {
          payload: broadcastMsg,
          roomMembers: clientsInRoom
        };

        let redisPublished = false;
        try {
          if (publisher && publisher.isReady) {
            await publisher.publish('messages', JSON.stringify(pubPacket));
            redisPublished = true;
            console.info('Redis room message published:', { roomID: msg.roomID });
          } else {
            throw new Error('Redis publisher is not connected');
          }
        } catch (redisErr) {
          console.warn('Redis publish failed, using local room broadcast:', redisErr.message);
        }

        // A connected publisher can publish successfully while this process's
        // subscriber is still starting. Keep local users in sync in that window.
        if (!redisPublished || !redisSubscriptionsReady) {
          broadcastLocally(clientsInRoom, broadcastMsg);
        }
      } catch (err) {
        console.error('Error saving message:', err);
        ws.send(JSON.stringify({ error: 'Failed to save message to database' }));
      }

    });

    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  return wss;
}

module.exports = setupWebSocket;
