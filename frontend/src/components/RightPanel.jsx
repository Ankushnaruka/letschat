import { useState } from "react";
import RequestModal from "./RequestModal";

export default function RightPanel({ room, onAcceptRequest, onRejectRequest, onAddMemberByUsername, currentUserId, token }) {
  const admins = room.admins || [];
  const members = room.memberDetails || room.members || [];
  const requests = room.requests || [];

  const [openReq, setOpenReq] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [addingMember, setAddingMember] = useState(false);

  const isCurrentUserAdmin = admins.some((a) => {
    if (!a) return false;
    if (typeof a === "string") return a === currentUserId;
    return a._id === currentUserId;
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    setAddingMember(true);
    try {
      await onAddMemberByUsername(usernameInput.trim());
      setUsernameInput("");
    } finally {
      setAddingMember(false);
    }
  };

  return (
    <div className="right-panel">
      {/* Room info */}
      <div className="rp-head">
        <div className="rp-avatar">{room.name?.[0]?.toUpperCase()}</div>
        <div className="rp-name">{room.name}</div>
        <div className="rp-unique">#{room.uniqueName}</div>
      </div>

      {/* Member list */}
      <div className="rp-body">
        <div className="rp-section-label">Members · {members.length}</div>
        {members.map((m, i) => {
          const memberId = m._id || m;
          const mname = m.username || `Member ${i + 1}`;
          const isAdmin = admins.some((a) =>
            typeof a === "string" ? a === memberId : a._id === memberId
          );
          return (
            <div key={memberId || i} className="member-row">
              <div className="member-av">{mname[0]?.toUpperCase()}</div>
              <span className="member-name">{mname}</span>
              {isAdmin && <span className="badge-admin">admin</span>}
            </div>
          );
        })}
      </div>

      {/* Add member (admin only) */}
      {isCurrentUserAdmin && (
        <div className="rp-add-form">
          <div className="rp-add-label">Add member</div>
          <form className="rp-add-row" onSubmit={handleAdd}>
            <input
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Username…"
            />
            <button type="submit" disabled={addingMember || !usernameInput.trim()}>
              {addingMember ? "…" : "Add"}
            </button>
          </form>
        </div>
      )}

      {/* Join requests */}
      <div className="rp-requests">
        <div className="rp-req-head">
          <span className="rp-req-label">Requests</span>
          <button className="rp-req-btn" onClick={() => setOpenReq(true)}>
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
