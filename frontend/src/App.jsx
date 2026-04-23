import { useState, useCallback } from "react";
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

export default function App() {
  const [auth, setAuth] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  const showToast = (msg, type = "success") => setToast({ msg, type });

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

  const handleAuth = (authData) => {
    setAuth(authData);
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
          onSignOut={() => setAuth(null)}
        />

        <div className="main">
          {activeRoom ? (
            <>
              <ChatHeader
                room={activeRoom}
                onLeave={leaveRoom}
                onDelete={deleteRoom}
              />
              <MessageList messages={messages} username={auth.username} userId={auth.userId} />
              <MessageInput
                onSend={sendMessage}
                disabled={wsStatus !== "connected"}
              />
            </>
          ) : (
            <EmptyState />
          )}
        </div>

        {activeRoom && <RightPanel room={activeRoom} />}

        {showCreate && (
          <CreateRoomModal
            token={auth.accessToken}
            onClose={() => setShowCreate(false)}
            onCreated={(room) => {
              setRooms((r) => [...r, room]);
              setShowCreate(false);
              showToast("Room created!");
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
