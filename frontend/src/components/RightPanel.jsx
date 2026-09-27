import { useState } from 'react';
import RequestModal from './RequestModal';

export default function RightPanel({ room, onAcceptRequest, onRejectRequest, onAddMemberByUsername, currentUserId, token }) {
  const admins = room.admins || [];
  const members = room.memberDetails || room.members || [];
  const requests = room.requests || [];

  const [openReq, setOpenReq] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [addingMember, setAddingMember] = useState(false);

  const isCurrentUserAdmin = admins.some((a) => {
    if (!a) return false;
    if (typeof a === 'string') return a === currentUserId;
    return a._id === currentUserId;
  });

  const handleAddByUsername = async (e) => {
    e.preventDefault();
    if (!onAddMemberByUsername) return;
    setAddingMember(true);
    try {
      await onAddMemberByUsername(usernameInput);
      setUsernameInput('');
    } finally {
      setAddingMember(false);
    }
  };

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
        const isAdmin = admins.some((a) => (typeof a === 'string' ? a === memberId : a._id === memberId));
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

      {isCurrentUserAdmin && (
        <div style={{ padding: '12px 18px 4px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)', marginBottom: 8 }}>Add member</div>
          <form onSubmit={handleAddByUsername} style={{ display: 'flex', gap: 8 }}>
            <input
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Username"
              style={{ flex: 1, minWidth: 0 }}
            />
            <button type="submit" className="h-btn" disabled={addingMember}>
              {addingMember ? 'Adding…' : 'Add'}
            </button>
          </form>
        </div>
      )}

      <div style={{ padding: '12px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)' }}>Requests</div>
          <button className="h-btn" onClick={() => setOpenReq(true)}>
            View ({requests.length})
          </button>
        </div>
      </div>

      {openReq && (
        <RequestModal
          roomId={room._id}
          requests={requests}
          onClose={() => setOpenReq(false)}
          onAccept={onAcceptRequest}
          onReject={onRejectRequest}
          currentUserId={currentUserId}
          isAdmin={isCurrentUserAdmin}
          token={token}
        />
      )}
    </div>
  );
}
