const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const Room = require('../models/roomSchema');

const clients = new Map();

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    // Parse token from query string
    const params = new URLSearchParams(req.url.split('?')[1]);
    const token = params.get('token');

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

      // Broadcast to all connected members in the room
      for (let [client, clientUserId] of clients.entries()) {
        if (
          clientsInRoom.includes(clientUserId.toString()) &&
          client.readyState === WebSocket.OPEN
        ) {
          client.send(JSON.stringify(msg));
        }
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
    });
  });

  return wss;
}

module.exports = setupWebSocket;