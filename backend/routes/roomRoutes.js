const express = require('express');
const router = express.Router();
const jwtAuth = require('../middlewares/jwtAuth');
const addMember = require('../controllers/addMember');
const makeRoom = require('../controllers/makeRoom');
const leaveRoom = require('../controllers/leaveRoom');
const makeAdmin = require('../controllers/makeAdmin');
const removeMember = require('../controllers/removeMember');
const deleteRoom = require('../controllers/deleteRoom');
const removeAdmin = require('../controllers/removeAdmin');
const getRoomMessages = require('../controllers/getMessages');

// Room routes
router.post('/add-member', jwtAuth, addMember);
router.post('/make-room', jwtAuth, makeRoom);
router.post('/leave', jwtAuth, leaveRoom);
router.post('/make-admin', jwtAuth, makeAdmin);
router.post('/remove-member', jwtAuth, removeMember);
router.post('/delete-room', jwtAuth, deleteRoom);
router.post('/remove-admin',jwtAuth,removeAdmin);
router.get('/get-messages', jwtAuth, getRoomMessages);

module.exports = router;