const Room = require('../models/roomSchema');
const User = require('../models/userSchema');

async function makeAdmin(req, res) {
  try {
    const { roomId, userIdToMakeAdmin } = req.body;
    const currentUserId = req.user._id;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const isAdmin = room.admins.some(
      adminId => adminId.toString() === currentUserId.toString()
    );
    if (!isAdmin) return res.status(403).json({ message: 'Only admins can make other admins' });

    const userToMakeAdmin = await User.findById(userIdToMakeAdmin);
    if (!userToMakeAdmin) return res.status(404).json({ message: 'User not found' });

    const isAlreadyAdmin = room.admins.some(
      adminId => adminId.toString() === userIdToMakeAdmin.toString()
    );
    if (isAlreadyAdmin) return res.status(400).json({ message: 'User is already an admin' });

    // Optionally, add user to members if not already
    const isMember = room.members.some(
      memberId => memberId.toString() === userIdToMakeAdmin.toString()
    );
    if (!isMember) {
      room.members.push(userIdToMakeAdmin);
      await User.findByIdAndUpdate(
        userIdToMakeAdmin,
        { $addToSet: { rooms: room._id } }
      );
    }

    // Add user to admins
    room.admins.push(userIdToMakeAdmin);
    await room.save();

    res.json({ message: 'User promoted to admin successfully', room });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = makeAdmin;