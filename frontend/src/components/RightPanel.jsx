export default function RightPanel({ room }) {
  const admins = room.admins || [];
  const members = room.memberDetails || room.members || [];
  const requests = room.requests || [];

  return (
    <div className="right-panel">
      <div className="rp-header">
        <div className="rp-avatar">{room.name?.[0]?.toUpperCase()}</div>
        <div className="rp-name">{room.name}</div>
        <div className="rp-uniq">#{room.uniqueName}</div>
      </div>

      <div className="rp-section">members</div>
      {members.map((m, i) => {
        const memberId = m._id || m;
        const username = m.username || `Member ${i + 1}`;
        const isAdmin = admins.includes(memberId);
        return (
          <div key={memberId || i} className="member-item">
            <div
              className="member-dot"
              style={isAdmin ? { background: "var(--accent2)" } : {}}
            />
            <span>{username}</span>
            {isAdmin && <span className="badge-admin">admin</span>}
          </div>
        );
      })}

      {requests.length > 0 && (
        <>
          <div className="rp-section">requests ({requests.length})</div>
          {requests.map((r, i) => (
            <div key={r._id || i} className="member-item">
              <div
                className="member-dot"
                style={{ background: "#f59e0b" }}
              />
              <span>{r.username || `Request ${i + 1}`}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
