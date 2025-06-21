const Room = require('../models/roomSchema');
const User = require('../models/userSchema');

async function removeAdmin(req, res) {
  try {
    const { roomId, userIdToRemoveAdmin } = req.body;
    const currentUserId = req.user._id;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const isAdmin = room.admins.some(
      adminId => adminId.toString() === currentUserId.toString()
    );
    if (!isAdmin) return res.status(403).json({ message: 'Only admins can remove admins' });

    const isTargetAdmin = room.admins.some(
      adminId => adminId.toString() === userIdToRemoveAdmin.toString()
    );
    if (!isTargetAdmin) return res.status(400).json({ message: 'User is not an admin' });

    // Remove user from admins
    room.admins = room.admins.filter(
      adminId => adminId.toString() !== userIdToRemoveAdmin.toString()
    );
    await room.save();

    res.json({ message: 'Admin rights removed successfully', room });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = removeAdmin;