require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors'); // <-- Add this line
const setupWebSocket = require('./ws/wsServer');
const roomRoutes = require('./routes/roomRoutes');

const app = express();

// Allow CORS for your frontend port
app.use(cors({
  origin: 'http://localhost:5173', // Change this to your frontend URL if different
  credentials: true
}));

app.use(express.json());
app.use('/api/rooms', roomRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/auth', userRoutes);

const server = http.createServer(app);
setupWebSocket(server);

server.listen(process.env.PORT, () => {
  console.log(`server started on http://localhost:${process.env.PORT}`);
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('connected to database'))
  .catch(err => console.error('MongoDB connection error:', err));