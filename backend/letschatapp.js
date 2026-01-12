require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const setupWebSocket = require('./ws/wsServer');
const roomRoutes = require('./routes/roomRoutes');
const userRoutes = require('./routes/userRoutes');
const StartKeepAlivePing = require('./keepalive');

const app = express();

// Allow CORS with credentials
app.use(cors({
  origin: process.env.FRONTEND_URI || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api/rooms', roomRoutes);
app.use('/api/auth', userRoutes);

// Health check route for Render ping
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const server = http.createServer(app);
    setupWebSocket(server);

    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server started on http://localhost:${process.env.PORT}`);

      // Start keep-alive only after server is ready
      StartKeepAlivePing();
    });

  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
  }
}

startServer();
