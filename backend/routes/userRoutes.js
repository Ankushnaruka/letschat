const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

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

module.exports = router;