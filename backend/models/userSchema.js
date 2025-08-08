const mongoose = require('mongoose');
const { type } = require('os');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  rooms:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Room',
    required:true
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);