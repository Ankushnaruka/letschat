const Room = require('../models/roomSchema');
const User = require('../models/userSchema');

async function leaveRoom(req, res) {
  try {
    const { roomId } = req.body;
    const currentUserId = req.user._id;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const isMember = room.members.some(
      memberId => memberId.toString() === currentUserId.toString()
    );
    if (!isMember) return res.status(400).json({ message: 'You are not a member of this group' });

    // Remove user from room's members and admins
    room.members = room.members.filter(
      memberId => memberId.toString() !== currentUserId.toString()
    );
    room.admins = room.admins.filter(
      adminId => adminId.toString() !== currentUserId.toString()
    );
    await room.save();

    // Remove room from user's rooms array
    await User.findByIdAndUpdate(
      currentUserId,
      { $pull: { rooms: room._id } }
    );

    res.json({ message: 'You have left the room', room });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = leaveRoom;