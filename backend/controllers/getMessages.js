const Message = require('../models/messageSchema');
const Room = require('../models/roomSchema');

async function getRoomMessages(req, res) {
    try {
        console.log('Fetching messages for room:', req.body.roomId);
        const { roomId } = req.body;
        const currentUserId = req.user._id; // from authentication middleware

        if (!roomId) {
            return res.status(400).json({ error: 'Room ID is required' });
        }

        // Check if room exists
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ error: 'Room does not exist' });
        }

        // Check if user is a member of the room
        if (!room.members.map(id => id.toString()).includes(currentUserId.toString())) {
            return res.status(403).json({ error: 'You are not a member of this room' });
        }

        // Fetch all messages in this room (oldest first)
        const messages = await Message.find({ room: roomId })
            .sort({ createdAt: 1 })
            .populate('sender', 'username'); // populate sender's username only

        return res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching room messages:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}

module.exports = getRoomMessages;
