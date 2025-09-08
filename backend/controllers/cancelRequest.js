const Room = require('../models/roomSchema');

async function cancelRequest(req, res){
    try {
        const { roomId } = req.body;
        const currentUserId = req.user._id;
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: 'Room not found' });
        const hasRequested = room.requests.some(
            requestId => requestId.toString() === currentUserId.toString()
        );
        if (!hasRequested) return res.status(400).json({ message: 'You have not requested to join this room' });

        // remove user from room's requests
        room.requests = room.requests.filter(
            requestId => requestId.toString() !== currentUserId.toString()
        );
        await room.save();
        res.json({ message: 'Join request cancelled successfully', room });
    }catch(err){
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

module.exports = cancelRequest;