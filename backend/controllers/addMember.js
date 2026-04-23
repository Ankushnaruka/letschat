const Room = require('../models/roomSchema');
const User = require('../models/userSchema');

async function addMember(req, res) {
  try {
    const { roomId, userIdToAdd, username } = req.body;
    const currentUserId = req.user._id;

    // If username provided, look up user ID
    let userToAddId = userIdToAdd;
    if (username && !userIdToAdd) {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      userToAddId = user._id;
    }

    if (!userToAddId) {
      return res.status(400).json({ message: 'User ID or username required' });
    }

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const isAdmin = room.admins.some(
      adminId => adminId.toString() === currentUserId.toString()
    );
    if (!isAdmin) return res.status(403).json({ message: 'Only admins can add members' });

    const isAlreadyMember = room.members.some(
      memberId => memberId.toString() === userToAddId.toString()
    );
    if (isAlreadyMember) return res.status(400).json({ message: 'User is already a member' });

    // Add user to room's members
    room.members.push(userToAddId);
    await room.save();

    //if user had requested to join, remove from requests
    room.requests = room.requests.filter(
      requestId => requestId.toString() !== userToAddId.toString()
    );
    await room.save();

    // Add room to user's rooms array
    await User.findByIdAndUpdate(
      userToAddId,
      { $addToSet: { rooms: room._id } }
    );

    res.json({ message: 'Member added successfully', room });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = addMember;