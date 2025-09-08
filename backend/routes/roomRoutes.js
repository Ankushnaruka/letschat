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
const requestRoomjoin = require('../controllers/requestRoomjoin');
const cancelRequest = require('../controllers/cancelRequest');

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

module.exports = router;