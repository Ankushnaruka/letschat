const Room = require('../models/roomSchema');

async function requestRoomjoin(req, res){
    try {
        const { roomId } = req.body;
        const currentUserId = req.user._id;

        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        const isAlreadyMember = room.members.some(
            memberId => memberId.toString() === currentUserId.toString()
        );
        if (isAlreadyMember) return res.status(400).json({ message: 'You are already a member of this room' });

        const hasRequested = room.requests.some(
            requestId => requestId.toString() === currentUserId.toString()
        );
        if (hasRequested) return res.status(400).json({ message: 'You have already requested to join this room' });

        // add user to room's requests
        room.requests.push(currentUserId);
        await room.save();
        res.json({ message: 'Join request sent successfully', room });

    }catch(err){
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

module.exports = requestRoomjoin;