const Message = require('../models/messageSchema');
const Room = require('../models/roomSchema');

async function getRoomMessages(req, res) {
    try {
        const { roomId, before, limit = 40 } = req.body;
        const currentUserId = req.user._id;

        if (!roomId) {
            return res.status(400).json({ error: 'Room ID is required' });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ error: 'Room does not exist' });
        }

        if (!room.members.map(id => id.toString()).includes(currentUserId.toString())) {
            return res.status(403).json({ error: 'You are not a member of this room' });
        }

        const pageLimit = Math.min(parseInt(limit) || 40, 100);

        // Build query: if "before" cursor provided, fetch messages older than that
        const query = { room: roomId };
        if (before) {
            query.createdAt = { $lt: new Date(before) };
        }

        const messages = await Message.find(query)
            .sort({ createdAt: -1 })
            .limit(pageLimit)
            .populate('sender', 'username');

        // Return oldest-first so the frontend can append in correct order
        const ordered = messages.reverse();

        const hasMore = messages.length === pageLimit;

        return res.status(200).json({ messages: ordered, hasMore });
    } catch (error) {
        console.error('Error fetching room messages:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}

module.exports = getRoomMessages;
