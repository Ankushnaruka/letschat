const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const Room = require('../models/roomSchema');
const Message = require('../models/messageSchema');
const { publisher, subscriber } = require('../config/redis');
require('dotenv').config();

const clients = new Map();

async function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  // Subscribe to Redis messages channel
  await subscriber.subscribe('messages', (raw) => {
    try {
      const parsed = JSON.parse(raw);
      const broadcastPayload = parsed.payload;
      const roomMembers = parsed.roomMembers || [];

      for (let [client, clientUserId] of clients.entries()) {
        if (roomMembers.includes(clientUserId.toString()) && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(broadcastPayload));
        }
      }
    } catch (err) {
      console.error('Invalid pubsub message:', err);
    }
  });

  wss.on('connection', (ws, req) => {
    // Parse token from query string
    //const params = new URLSearchParams(req.url.split('?')[1]);

    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

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

        // Include message metadata in the broadcast
        const broadcastMsg = {
          _id: savedMessage._id,
          sender: ws.userId,
          roomID: msg.roomID,
          text: msg.text,
          time: savedMessage.createdAt,
          media: msg.media || null,
        };

        // Publish to Redis for all server instances
        const pubPacket = {
          payload: broadcastMsg,
          roomMembers: clientsInRoom
        };
        await publisher.publish('messages', JSON.stringify(pubPacket));
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