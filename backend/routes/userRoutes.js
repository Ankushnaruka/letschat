const express = require('express');
const router = express.Router();
const { signup, login, logout } = require('../controllers/authController');
const {refreshTokengen} = require('../controllers/refressToken');
const { forgotPassword, verifyCode, resetPassword } = require('../controllers/forgotPassword.js');

const jwtAuth = require('../middlewares/jwtAuth');
const Room = require('../models/roomSchema');

router.get('/my-rooms', jwtAuth, async (req, res) => {
  try {
    // req.user._id is set by jwtAuth middleware
    const rooms = await Room.find({ members: req.user._id })
      .populate('members', 'username email _id')
      .populate('admins', 'username email _id')
      .populate('requests', 'username email _id');
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user info by id (for request display)
router.get('/users/:id', jwtAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    const User = require('../models/userSchema');
    const user = await User.findById(userId).select('username email _id');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/verify-code', verifyCode);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshTokengen);

module.exports = router;