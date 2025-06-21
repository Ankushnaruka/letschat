const Room = require('../models/roomSchema');
const User = require('../models/userSchema');

async function removeMember(req, res) {
  try {
    const { roomId, userIdToRemove } = req.body;
    const currentUserId = req.user._id;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const isAdmin = room.admins.some(
      adminId => adminId.toString() === currentUserId.toString()
    );
    if (!isAdmin) return res.status(403).json({ message: 'Only admins can remove members' });

    const isMember = room.members.some(
      memberId => memberId.toString() === userIdToRemove.toString()
    );
    if (!isMember) return res.status(404).json({ message: 'User is not a member of the room' });

    // Remove user from room's members and admins
    room.members = room.members.filter(
      memberId => memberId.toString() !== userIdToRemove.toString()
    );
    room.admins = room.admins.filter(
      adminId => adminId.toString() !== userIdToRemove.toString()
    );
    await room.save();

    // Remove room from user's rooms array
    await User.findByIdAndUpdate(
      userIdToRemove,
      { $pull: { rooms: room._id } }
    );

    res.json({ message: 'Member removed successfully', room });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = removeMember;