import { useState } from "react";

export default function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="input-area">
      <button className="plus-btn">
        <svg
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
      <input
        className="msg-input"
        placeholder="Write message here…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
      />
      <button
        className="send-btn"
        onClick={handleSend}
        disabled={!text.trim() || disabled}
      >
        <svg
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" />
        </svg>
      </button>
    </div>
  );
}
