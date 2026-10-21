import { useState, useCallback, useEffect } from "react";
import { api } from "./utils/api";
import { useWebSocket } from "./hooks/useWebSocket";
import globalStyles from "./styles";

import AuthScreen from "./components/AuthScreen";
import Sidebar from "./components/Sidebar";
import ChatHeader from "./components/ChatHeader";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import RightPanel from "./components/RightPanel";
import CreateRoomModal from "./components/CreateRoomModal";
import EmptyState from "./components/EmptyState";
import Toast from "./components/Toast";

const API_BASE = import.meta.env.VITE_API_URL || "https://letschat-1-8pfq.onrender.com/api";

function isJwtExpired(token) {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return true;
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

const PAGE_SIZE = 40;

export default function App() {
  const [auth, setAuth] = useState(() => {
    try {
      const saved = localStorage.getItem("letschat-auth");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const loadRooms = useCallback(async (token) => {
    try {
      const data = await api("/auth/my-rooms", {}, token);
      setRooms(Array.isArray(data) ? data : []);
    } catch (e) {
      showToast(e.message, "error");
    }
  }, []);

  useEffect(() => {
    if (!auth?.accessToken) {
      localStorage.removeItem("letschat-auth");
      return;
    }
    if (isJwtExpired(auth.accessToken)) {
      setAuth(null);
      localStorage.removeItem("letschat-auth");
      return;
    }
    localStorage.setItem("letschat-auth", JSON.stringify(auth));
    loadRooms(auth.accessToken);
  }, [auth, loadRooms]);

  // Listen for auth invalidation from token refresh failure
  useEffect(() => {
    const handleInvalid = () => {
      setAuth(null);
      localStorage.removeItem("letschat-auth");
    };
    const handleUpdated = (e) => setAuth(e.detail);
    window.addEventListener("letschat:auth-invalid", handleInvalid);
    window.addEventListener("letschat:auth-updated", handleUpdated);
    return () => {
      window.removeEventListener("letschat:auth-invalid", handleInvalid);
      window.removeEventListener("letschat:auth-updated", handleUpdated);
    };
  }, []);

  // ── WebSocket ──────────────────────────────────────────────────────────────
  const handleWsMessage = useCallback((msg) => {
    setMessages((prev) => {
      const isMyMessage = msg.sender === auth?.userId;
      let filtered = prev;
      if (isMyMessage) {
        filtered = prev.filter(
          (m) => !(m.text === msg.text && m.sender?._id === "me")
        );
      }
      const isDuplicate = filtered.some((m) => m._id === msg._id);
      if (isDuplicate) return filtered;
      return [
        ...filtered,
        {
          _id: msg._id || Date.now(),
          createdAt: msg.time || new Date().toISOString(),
          text: msg.text,
          media: msg.media || null,
          sender: { _id: msg.sender, username: msg.senderUsername || "?" },
          room: msg.roomID,
          _mine: isMyMessage,
        },
      ];
    });
  }, [auth?.userId]);

  const { status: wsStatus, send: wsSend } = useWebSocket(
    auth?.accessToken,
    handleWsMessage
  );

  // ── Auth ───────────────────────────────────────────────────────────────────
  const handleAuth = (authData) => {
    setAuth(authData);
    if (authData?.accessToken) {
      localStorage.setItem("letschat-auth", JSON.stringify(authData));
    }
    loadRooms(authData.accessToken);
  };

  // ── Select room + initial message load ────────────────────────────────────
  const selectRoom = async (room) => {
    setActiveRoom(room);
    setMessages([]);
    setHasMore(false);
    try {
      const data = await api(
        "/rooms/get-messages",
        { method: "POST", body: { roomId: room._id, limit: PAGE_SIZE } },
        auth.accessToken
      );
      const msgs = Array.isArray(data) ? data : (data.messages || []);
      setMessages(msgs);
      setHasMore(data.hasMore ?? false);
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  // ── Lazy load older messages ───────────────────────────────────────────────
  const loadMoreMessages = useCallback(async () => {
    if (!activeRoom || loadingMore || !hasMore) return;
    const oldest = messages[0];
    if (!oldest) return;
    setLoadingMore(true);
    try {
      const data = await api(
        "/rooms/get-messages",
        {
          method: "POST",
          body: {
            roomId: activeRoom._id,
            before: oldest.createdAt,
            limit: PAGE_SIZE,
          },
        },
        auth.accessToken
      );
      const older = Array.isArray(data) ? data : (data.messages || []);
      setMessages((prev) => [...older, ...prev]);
      setHasMore(data.hasMore ?? false);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setLoadingMore(false);
    }
  }, [activeRoom, messages, loadingMore, hasMore, auth]);

  // ── Send text message ──────────────────────────────────────────────────────
  const sendMessage = (text) => {
    if (!activeRoom) return;
    const sent = wsSend({ text, roomID: activeRoom._id });
    if (sent) {
      setMessages((prev) => [
        ...prev,
        {
          _id: `opt-${Date.now()}`,
          createdAt: new Date().toISOString(),
          text,
          media: null,
          sender: { _id: "me", username: auth.username },
          _mine: true,
        },
      ]);
    } else {
      showToast("Not connected to chat server", "error");
    }
  };

  // ── File upload (backend → Cloudinary) ────────────────────────────────────
  const uploadFile = async (file) => {
    if (!activeRoom) {
      showToast("Select a room first", "error");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/rooms/upload-file`, {
        method: "POST",
        headers: { Authorization: `Bearer ${auth.accessToken}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      const url = data.url;
      const sent = wsSend({ text: "", roomID: activeRoom._id, media: url });
      if (sent) {
        setMessages((prev) => [
          ...prev,
          {
            _id: `opt-${Date.now()}`,
            createdAt: new Date().toISOString(),
            text: "",
            media: url,
            sender: { _id: "me", username: auth.username },
            _mine: true,
          },
        ]);
        showToast("File sent");
      } else {
        showToast("Not connected to chat server", "error");
      }
    } catch (e) {
      showToast(e.message || "Upload error", "error");
    }
  };

  // ── Room actions ───────────────────────────────────────────────────────────
  const requestJoin = async (roomId) => {
    try {
      const data = await api(
        "/rooms/request-joinroom",
        { method: "POST", body: { roomId } },
        auth.accessToken
      );
      await loadRooms(auth.accessToken);
      if (activeRoom?._id === roomId)
        setActiveRoom((r) => ({ ...r, requests: data.room?.requests || [] }));
      showToast("Join request sent");
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const cancelJoinRequest = async (roomId) => {
    try {
      const data = await api(
        "/rooms/cancel-request",
        { method: "POST", body: { roomId } },
        auth.accessToken
      );
      await loadRooms(auth.accessToken);
      if (activeRoom?._id === roomId)
        setActiveRoom((r) => ({ ...r, requests: data.room?.requests || [] }));
      showToast("Join request cancelled");
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const leaveRoom = async () => {
    try {
      await api(
        "/rooms/leave",
        { method: "POST", body: { roomId: activeRoom._id } },
        auth.accessToken
      );
      setRooms((r) => r.filter((x) => x._id !== activeRoom._id));
      setActiveRoom(null);
      setMessages([]);
      showToast("Left room");
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const deleteRoom = async () => {
    try {
      await api(
        "/rooms/delete-room",
        { method: "POST", body: { roomId: activeRoom._id } },
        auth.accessToken
      );
      setRooms((r) => r.filter((x) => x._id !== activeRoom._id));
      setActiveRoom(null);
      setMessages([]);
      showToast("Room deleted");
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const acceptRequest = async (roomId, userId) => {
    try {
      const data = await api(
        "/rooms/add-member",
        { method: "POST", body: { roomId, userIdToAdd: userId } },
        auth.accessToken
      );
      await loadRooms(auth.accessToken);
      if (activeRoom?._id === roomId) setActiveRoom(data.room || activeRoom);
      showToast("User added");
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const rejectRequestAdmin = async (roomId, userId) => {
    try {
      const data = await api(
        "/rooms/reject-request",
        { method: "POST", body: { roomId, userIdToReject: userId } },
        auth.accessToken
      );
      await loadRooms(auth.accessToken);
      if (activeRoom?._id === roomId) setActiveRoom(data.room || activeRoom);
      showToast("Request rejected");
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const addMemberByUsername = async (username) => {
    if (!activeRoom) { showToast("Select a room first", "error"); return; }
    const trimmed = (username || "").trim();
    if (!trimmed) { showToast("Enter a username", "error"); return; }
    try {
      const data = await api(
        "/rooms/add-member",
        { method: "POST", body: { roomId: activeRoom._id, username: trimmed } },
        auth.accessToken
      );
      await loadRooms(auth.accessToken);
      setActiveRoom((prev) =>
        prev?._id === activeRoom._id ? data.room || prev : prev
      );
      showToast("Member added");
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (!auth) {
    return (
      <>
        <style>{globalStyles}</style>
        <AuthScreen onAuth={handleAuth} />
      </>
    );
  }

  return (
    <>
      <style>{globalStyles}</style>
      <div className="app">
        <Sidebar
          username={auth.username}
          wsStatus={wsStatus}
          rooms={rooms}
          activeRoom={activeRoom}
          search={search}
          onSearch={setSearch}
          onSelectRoom={selectRoom}
          onCreateRoom={() => setShowCreate(true)}
          onRefresh={() => loadRooms(auth.accessToken)}
          onSignOut={() => {
            setAuth(null);
            localStorage.removeItem("letschat-auth");
          }}
        />

        <div className="main">
          {activeRoom ? (
            <>
              <ChatHeader
                room={activeRoom}
                onLeave={leaveRoom}
                onDelete={deleteRoom}
                onRequestJoin={requestJoin}
                onCancelRequest={cancelJoinRequest}
                userId={auth.userId}
              />
              <MessageList
                messages={messages}
                username={auth.username}
                userId={auth.userId}
                hasMore={hasMore}
                loadingMore={loadingMore}
                onLoadMore={loadMoreMessages}
              />
              <MessageInput
                onSend={sendMessage}
                onUpload={uploadFile}
                disabled={wsStatus !== "connected"}
              />
            </>
          ) : (
            <EmptyState />
          )}
        </div>

        {activeRoom && (
          <RightPanel
            room={activeRoom}
            onAcceptRequest={acceptRequest}
            onRejectRequest={rejectRequestAdmin}
            onAddMemberByUsername={addMemberByUsername}
            currentUserId={auth.userId}
            token={auth.accessToken}
          />
        )}

        {showCreate && (
          <CreateRoomModal
            token={auth.accessToken}
            onClose={() => setShowCreate(false)}
            onCreated={(room) => {
              setRooms((r) => [...r, room]);
              setShowCreate(false);
              showToast("Room created!");
            }}
            onRequestSent={() => {
              setShowCreate(false);
              showToast("Join request sent");
            }}
          />
        )}

        {toast && (
          <Toast
            msg={toast.msg}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </>
  );
}
