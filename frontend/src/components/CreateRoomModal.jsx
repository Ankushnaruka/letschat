import { useState } from "react";
import { api } from "../utils/api";

export default function CreateRoomModal({ token, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [uname, setUname] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const create = async () => {
    setErr("");
    setLoading(true);
    try {
      const data = await api(
        "/rooms/make-room",
        { method: "POST", body: { name, uniqueName: uname } },
        token
      );
      onCreated(data.room);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-title">Create a Room</div>
        <div className="field">
          <label>Room Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="General Chat"
          />
        </div>
        <div className="field">
          <label>Unique Name</label>
          <input
            value={uname}
            onChange={(e) => setUname(e.target.value)}
            placeholder="general-chat"
          />
        </div>
        {err && <div className="err-msg">{err}</div>}
        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            style={{ flex: 1 }}
            onClick={create}
            disabled={loading}
          >
            {loading ? "Creating…" : "Create Room"}
          </button>
        </div>
      </div>
    </div>
  );
}
