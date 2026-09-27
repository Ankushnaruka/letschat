const Room = require('../models/roomSchema');

async function rejectRequest(req, res) {
  try {
    const { roomId, userIdToReject } = req.body;
    const currentUserId = req.user._id;

    if (!roomId || !userIdToReject) return res.status(400).json({ message: 'roomId and userIdToReject required' });

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const isAdmin = room.admins.some(
      adminId => adminId.toString() === currentUserId.toString()
    );
    if (!isAdmin) return res.status(403).json({ message: 'Only admins can reject requests' });

    const hasRequested = room.requests.some(
      requestId => requestId.toString() === userIdToReject.toString()
    );
    if (!hasRequested) return res.status(400).json({ message: 'User has not requested to join this room' });

    room.requests = room.requests.filter(
      requestId => requestId.toString() !== userIdToReject.toString()
    );
    await room.save();

    res.json({ message: 'Request rejected', room });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = rejectRequest;
