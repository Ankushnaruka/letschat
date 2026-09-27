import { useState } from "react";
import { api } from "../utils/api";

export default function CreateRoomModal({ token, onClose, onCreated, onRequestSent }) {
  const [mode, setMode] = useState("choice");
  const [name, setName] = useState("");
  const [uname, setUname] = useState("");
  const [joinQuery, setJoinQuery] = useState("");
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

  const requestJoin = async () => {
    setErr("");
    setLoading(true);
    try {
      const term = joinQuery.trim();
      if (!term) throw new Error("Enter a room name or unique name");

      const rooms = await api(
        `/rooms/all-rooms?search=${encodeURIComponent(term)}`,
        {},
        token
      );

      const exactMatch = rooms.find(
        (room) =>
          room.uniqueName?.toLowerCase() === term.toLowerCase() ||
          room.name?.toLowerCase() === term.toLowerCase()
      );

      const selectedRoom = exactMatch || rooms[0];
      if (!selectedRoom) throw new Error("No room found");

      await api(
        "/rooms/request-joinroom",
        { method: "POST", body: { roomId: selectedRoom._id } },
        token
      );

      if (onRequestSent) {
        onRequestSent();
      } else {
        onClose();
      }
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
        <div className="modal-title">
          {mode === "choice"
            ? "Choose an action"
            : mode === "create"
              ? "Create a Room"
              : "Request to Join"}
        </div>

        {mode === "choice" && (
          <div style={{ display: "grid", gap: 12 }}>
            <button className="btn-primary" onClick={() => setMode("create")}>
              Create a room
            </button>
            <button className="btn-ghost" onClick={() => setMode("request")}>
              Request to join a room
            </button>
          </div>
        )}

        {mode === "create" && (
          <>
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
          </>
        )}

        {mode === "request" && (
          <div className="field">
            <label>Room name or unique name</label>
            <input
              value={joinQuery}
              onChange={(e) => setJoinQuery(e.target.value)}
              placeholder="general-chat or General Chat"
            />
          </div>
        )}

        {err && <div className="err-msg">{err}</div>}

        <div className="modal-actions">
          <button
            className="btn-ghost"
            onClick={() => {
              if (mode === "choice") onClose();
              else setMode("choice");
            }}
          >
            {mode === "choice" ? "Cancel" : "Back"}
          </button>

          {mode === "create" && (
            <button
              className="btn-primary"
              style={{ flex: 1 }}
              onClick={create}
              disabled={loading}
            >
              {loading ? "Creating…" : "Create Room"}
            </button>
          )}

          {mode === "request" && (
            <button
              className="btn-primary"
              style={{ flex: 1 }}
              onClick={requestJoin}
              disabled={loading}
            >
              {loading ? "Sending…" : "Send Request"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
