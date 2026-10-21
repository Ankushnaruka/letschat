export default function ChatHeader({ room, onLeave, onDelete, onRequestJoin, onCancelRequest, userId }) {
  const isMember = (room.members || []).some((m) => {
    if (!m) return false;
    if (typeof m === "string") return m === userId;
    return m._id === userId;
  });
  const isRequested = (room.requests || []).some((r) => {
    if (!r) return false;
    if (typeof r === "string") return r === userId;
    if (r._id) return r._id === userId;
    if (r.userId) return r.userId === userId;
    if (r.user?._id) return r.user._id === userId;
    return false;
  });
  const isAdmin = (room.admins || []).some((a) => {
    if (!a) return false;
    if (typeof a === "string") return a === userId;
    return a._id === userId;
  });

  return (
    <div className="chat-header">
      <div className="ch-avatar">{room.name?.[0]?.toUpperCase()}</div>
      <div className="ch-info">
        <div className="ch-name">{room.name}</div>
        <div className="ch-meta">
          {room.members?.length || 0} members · #{room.uniqueName}
        </div>
      </div>
      <div className="ch-actions">
        {!isMember && !isRequested && (
          <button className="ch-btn primary" onClick={() => onRequestJoin(room._id)}>
            Request to Join
          </button>
        )}
        {!isMember && isRequested && (
          <button className="ch-btn" onClick={() => onCancelRequest(room._id)}>
            Cancel Request
          </button>
        )}
        {isMember && (
          <button className="ch-btn" onClick={onLeave}>
            Leave Room
          </button>
        )}
        {isAdmin && (
          <button className="ch-btn danger" onClick={onDelete}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
