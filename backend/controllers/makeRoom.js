const Room = require('../models/roomSchema');
const User = require('../models/userSchema');

async function createRoom(req, res) {
  try {
    const { name } = req.body;
    const currentUserId = req.user._id;

    const existingRoom = await Room.findOne({ name });
    if (existingRoom) return res.status(400).json({ message: 'Room name already exists' });

    const room = new Room({
      name,
      admins: [currentUserId],
      members: [currentUserId]
    });

    await room.save();

    // Add room to user's rooms array
    await User.findByIdAndUpdate(
      currentUserId,
      { $addToSet: { rooms: room._id } }
    );

    res.status(201).json({ message: 'Room created successfully', room });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = createRoom;