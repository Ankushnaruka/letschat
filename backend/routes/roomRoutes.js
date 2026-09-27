const express = require('express');
const router = express.Router();
const jwtAuth = require('../middlewares/jwtAuth');
const Room = require('../models/roomSchema');
const addMember = require('../controllers/addMember');
const makeRoom = require('../controllers/makeRoom');
const leaveRoom = require('../controllers/leaveRoom');
const makeAdmin = require('../controllers/makeAdmin');
const removeMember = require('../controllers/removeMember');
const deleteRoom = require('../controllers/deleteRoom');
const removeAdmin = require('../controllers/removeAdmin');
const getRoomMessages = require('../controllers/getMessages');
const requestRoomjoin = require('../controllers/requestRoomjoin');
const cancelRequest = require('../controllers/cancelRequest');
const rejectRequest = require('../controllers/rejectRequest');

// Get all rooms with search
router.get('/all-rooms', jwtAuth, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      // Search by room name or unique name (case-insensitive)
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { uniqueName: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const rooms = await Room.find(query)
      .populate('members', 'username email _id')
      .populate('admins', 'username email _id')
      .populate('requests', 'username email _id')
      .sort({ createdAt: -1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Room routes
router.post('/add-member', jwtAuth, addMember);
router.post('/make-room', jwtAuth, makeRoom);
router.post('/leave', jwtAuth, leaveRoom);
router.post('/make-admin', jwtAuth, makeAdmin);
router.post('/remove-member', jwtAuth, removeMember);
router.post('/delete-room', jwtAuth, deleteRoom);
router.post('/remove-admin',jwtAuth,removeAdmin);
router.post('/get-messages', jwtAuth, getRoomMessages);
router.post('/request-joinroom', jwtAuth, requestRoomjoin);
router.post('/cancel-request', jwtAuth, cancelRequest);
router.post('/reject-request', jwtAuth, rejectRequest);

module.exports = router;