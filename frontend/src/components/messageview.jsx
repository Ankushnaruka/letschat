import React, { useEffect, useRef, useState } from "react";
import roomStore from "./activeroomstore";

function MessageView() {
  const activeroom = roomStore((state) => state.activeroom);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    if (!activeroom || !activeroom._id) return;

    const token = localStorage.getItem("token");
    ws.current = new WebSocket(`ws://localhost:8080?token=${token}`);

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received from WS:", data);

        // If server sends an array (history)
        if (Array.isArray(data)) {
          // Filter messages for this room
          setMessages(data.filter((msg) => msg.roomID === activeroom._id));
        }
        // If server sends a single message
        else if (data && data.roomID === activeroom._id) {
          setMessages((prev) => [...prev, data]);
        }
        // Optionally handle other message types here
      } catch (err) {
        console.error("Failed to parse WS message:", err);
      }
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    // Cleanup on room change or unmount
    return () => {
      ws.current && ws.current.close();
      setMessages([]);
    };
  }, [activeroom]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !ws.current || ws.current.readyState !== 1) return;
    const msg = {
      text: input,
      roomID: activeroom._id,
      time: new Date().toISOString(),
    };
    ws.current.send(JSON.stringify(msg));
    setInput("");
    // Do NOT update messages here; wait for server echo
  };

  if (!activeroom || !activeroom._id) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          background: "#030F1F",
        }}
      >
        Select a room to start chatting.
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "86vh",
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
          background: "#030F1F",
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 12, color: "#fff" }}>
            <span style={{ fontWeight: "bold" }}>{msg.sender || "You"}: </span>
            <span>{msg.text}</span>
            <span
              style={{
                fontSize: 12,
                color: "#aaa",
                marginLeft: 8,
              }}
            >
              {msg.time && new Date(msg.time).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
      <form
        onSubmit={sendMessage}
        style={{
          display: "flex",
          borderTop: "1px solid #222",
          background: "#10192A",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: 12,
            fontSize: 16,
            border: "none",
            outline: "none",
            background: "#030F1F",
            color: "#fff",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0 24px",
            background: "#222",
            color: "#fff",
            border: "none",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default MessageView;