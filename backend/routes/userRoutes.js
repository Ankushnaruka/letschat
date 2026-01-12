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
    const rooms = await Room.find({ members: req.user._id });
    res.json(rooms);
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