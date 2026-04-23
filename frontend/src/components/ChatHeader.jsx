export default function ChatHeader({ room, onLeave, onDelete }) {
  return (
    <div className="chat-header">
      <div className="chat-header-avatar">
        {room.name?.[0]?.toUpperCase()}
      </div>
      <div>
        <div className="chat-header-name">{room.name}</div>
        <div className="chat-header-meta">
          {room.members?.length || 0} members · {room.uniqueName}
        </div>
      </div>
      <div className="chat-header-right">
        <button className="h-btn" onClick={onLeave}>
          Leave
        </button>
        <button className="h-btn danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
