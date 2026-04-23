export default function Sidebar({
  username,
  wsStatus,
  rooms,
  activeRoom,
  search,
  onSearch,
  onSelectRoom,
  onCreateRoom,
  onRefresh,
  onSignOut,
}) {
  const filtered = rooms.filter((r) =>
    r.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          Lets<span>Chat</span>
          {wsStatus === "connected" && (
            <span
              style={{
                marginLeft: "auto",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#22c55e",
                display: "block",
              }}
            />
          )}
          {wsStatus === "connecting" && (
            <span className="connecting">connecting…</span>
          )}
          {wsStatus === "disconnected" && (
            <span className="offline">offline</span>
          )}
        </div>
        <div className="sidebar-user">@{username}</div>
      </div>

      <div style={{ padding: "12px 16px" }}>
        <div className="search-box">
          <svg
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            placeholder="Search rooms…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="sidebar-section">
        <span>Rooms ({filtered.length})</span>
        <button
          onClick={onCreateRoom}
          style={{
            background: "none",
            border: "none",
            color: "var(--accent2)",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          +
        </button>
      </div>

      <div className="room-list">
        {filtered.map((room) => (
          <div
            key={room._id}
            className={`room-item ${activeRoom?._id === room._id ? "active" : ""}`}
            onClick={() => onSelectRoom(room)}
          >
            <div className="room-avatar">
              {room.name?.[0]?.toUpperCase() || "#"}
            </div>
            <div className="room-info">
              <div className="room-name">{room.name}</div>
              <div className="room-preview">
                {room.members?.length || 0} members
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div
            style={{
              padding: "20px 12px",
              fontSize: 13,
              color: "var(--text2)",
              textAlign: "center",
            }}
          >
            No rooms yet. Create one!
          </div>
        )}
      </div>

      <div className="sidebar-actions">
        <button className="icon-btn" onClick={onRefresh}>
          ↻ Refresh
        </button>
        <button className="icon-btn danger" onClick={onSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
