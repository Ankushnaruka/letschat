const Room = require('../models/roomSchema');
const User = require('../models/userSchema');

async function deleteRoom(req, res) {
  try {
    const { roomId } = req.body;
    const currentUserId = req.user._id;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const isAdmin = room.admins.some(
      adminId => adminId.toString() === currentUserId.toString()
    );
    if (!isAdmin) return res.status(403).json({ message: 'Only admins can delete the room' });

    // Remove room from all users' rooms arrays
    await User.updateMany(
      { rooms: room._id },
      { $pull: { rooms: room._id } }
    );

    await Room.findByIdAndDelete(roomId);

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = deleteRoom;