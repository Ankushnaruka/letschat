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
  text: {
    type: String,
    required: true,
    trim: true
  },
  media: {
    type: String, // URL or path to the media file
    default: null,
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);