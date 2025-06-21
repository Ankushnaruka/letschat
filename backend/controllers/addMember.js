const Room = require('../models/roomSchema');
const User = require('../models/userSchema');

async function addMember(req, res) {
  try {
    const { roomId, userIdToAdd } = req.body;
    const currentUserId = req.user._id;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const isAdmin = room.admins.some(
      adminId => adminId.toString() === currentUserId.toString()
    );
    if (!isAdmin) return res.status(403).json({ message: 'Only admins can add members' });

    const isAlreadyMember = room.members.some(
      memberId => memberId.toString() === userIdToAdd.toString()
    );
    if (isAlreadyMember) return res.status(400).json({ message: 'User is already a member' });

    // Add user to room's members
    room.members.push(userIdToAdd);
    await room.save();

    // Add room to user's rooms array
    await User.findByIdAndUpdate(
      userIdToAdd,
      { $addToSet: { rooms: room._id } }
    );

    res.json({ message: 'Member added successfully', room });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = addMember;