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
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const loadRooms = useCallback(
    async (token) => {
      try {
        const data = await api("/auth/my-rooms", {}, token);
        setRooms(Array.isArray(data) ? data : []);
      } catch (e) {
        showToast(e.message, "error");
      }
    },
    []
  );

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

  // WebSocket message handler
  const handleWsMessage = useCallback((msg) => {
    setMessages((prev) => {
      // If this is a message from the current user, remove the optimistic placeholder
      const isMyMessage = msg.sender === auth?.userId;
      
      let filtered = prev;
      if (isMyMessage) {
        // Remove optimistic messages with same text
        filtered = prev.filter((m) => !(m.text === msg.text && m.sender?._id === "me"));
      }
      
      // Avoid duplicates by checking if message already exists
      const isDuplicate = filtered.some((m) => m._id === msg._id);
      if (isDuplicate) return filtered;
      
      return [
        ...filtered,
        {
          _id: msg._id || Date.now(),
          createdAt: msg.time || new Date().toISOString(),
          text: msg.text,
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

  const handleAuth = (authData) => {
    setAuth(authData);
    if (authData?.accessToken) {
      localStorage.setItem("letschat-auth", JSON.stringify(authData));
    }
    loadRooms(authData.accessToken);
  };

  const selectRoom = async (room) => {
    setActiveRoom(room);
    setMessages([]);
    try {
      const data = await api(
        "/rooms/get-messages",
        { method: "POST", body: { roomId: room._id } },
        auth.accessToken
      );
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const requestJoin = async (roomId) => {
    try {
      const data = await api(
        "/rooms/request-joinroom",
        { method: "POST", body: { roomId } },
        auth.accessToken
      );
      // refresh rooms
      await loadRooms(auth.accessToken);
      if (activeRoom && activeRoom._id === roomId) setActiveRoom((r) => ({ ...r, requests: data.room?.requests || [] }));
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
      if (activeRoom && activeRoom._id === roomId) setActiveRoom((r) => ({ ...r, requests: data.room?.requests || [] }));
      showToast("Join request cancelled");
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const uploadImage = async (file) => {
    const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD;
    const PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;
    if (!CLOUD || !PRESET) {
      showToast("Cloudinary config missing (VITE_CLOUDINARY_CLOUD / _PRESET)", "error");
      return;
    }
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/upload`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Upload failed");
      const url = data.secure_url;
      if (wsSend && activeRoom) {
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
        } else {
          showToast("Not connected to chat server", "error");
        }
      }
      showToast("Image uploaded");
    } catch (e) {
      showToast(e.message || "Upload error", "error");
    }
  };

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
          sender: { _id: "me", username: auth.username },
          _mine: true,
        },
      ]);
    } else {
      showToast("Not connected to chat server", "error");
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
      showToast("Left room successfully");
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
      if (activeRoom && activeRoom._id === roomId) setActiveRoom(data.room || activeRoom);
      showToast("User added to room");
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
      if (activeRoom && activeRoom._id === roomId) setActiveRoom(data.room || activeRoom);
      showToast("Request rejected");
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const addMemberByUsername = async (username) => {
    if (!activeRoom) {
      showToast("Select a room first", "error");
      return;
    }
    const trimmed = (username || "").trim();
    if (!trimmed) {
      showToast("Enter a username to add", "error");
      return;
    }

    try {
      const data = await api(
        "/rooms/add-member",
        { method: "POST", body: { roomId: activeRoom._id, username: trimmed } },
        auth.accessToken
      );
      await loadRooms(auth.accessToken);
      setActiveRoom((prev) => (prev && prev._id === activeRoom._id ? data.room || prev : prev));
      showToast("Member added to room");
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  if (!auth) {
    return (
      <>
        <style>{globalStyles}</style>
        <div className="app">
          <AuthScreen onAuth={handleAuth} />
        </div>
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
              <MessageList messages={messages} username={auth.username} userId={auth.userId} />
              <MessageInput
                onSend={sendMessage}
                onUpload={uploadImage}
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
