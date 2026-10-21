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

  const statusLabel = wsStatus === "connected" ? "online" : wsStatus === "connecting" ? "connecting" : "offline";

  return (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className="sidebar-brand-name">Lets<span>Chat</span></span>
          <div className={`ws-badge ${wsStatus}`}>
            <span className={`ws-dot ${wsStatus}`} />
            {statusLabel}
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar-sm">{username?.[0]?.toUpperCase()}</div>
          <span className="user-name-sm">@{username}</span>
        </div>
      </div>

      {/* Search */}
      <div className="sidebar-search">
        <div className="search-wrap">
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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

      {/* Rooms */}
      <div className="rooms-header">
        <span className="rooms-label">Rooms · {filtered.length}</span>
        <button className="rooms-add-btn" onClick={onCreateRoom} title="Create or join a room">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      <div className="room-list">
        {filtered.map((room) => (
          <div
            key={room._id}
            className={`room-item${activeRoom?._id === room._id ? " active" : ""}`}
            onClick={() => onSelectRoom(room)}
          >
            <div className="room-icon">
              {room.name?.[0]?.toUpperCase() || "#"}
            </div>
            <div className="room-info">
              <div className="room-name">{room.name}</div>
              <div className="room-meta">{room.members?.length || 0} members</div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rooms-empty">
            {search ? "No rooms match your search." : "No rooms yet.\nCreate or join one!"}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="footer-btn" onClick={onRefresh} title="Refresh rooms">
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6" /><path d="M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15" />
          </svg>
          Refresh
        </button>
        <button className="footer-btn danger" onClick={onSignOut} title="Sign out">
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign out
        </button>
      </div>
    </div>
  );
}
