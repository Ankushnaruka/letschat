const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true // every chat is a room
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);