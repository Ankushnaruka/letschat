import { useState, useRef, useCallback } from "react";

export default function MessageInput({ onSend, onUpload, disabled }) {
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSend = useCallback(() => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [text, disabled, onSend]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
    setText(el.value);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="input-area">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,application/pdf,.doc,.docx,.zip,.txt"
        style={{ display: "none" }}
        onChange={handleFile}
      />
      <div className="input-wrap">
        <textarea
          ref={textareaRef}
          className="msg-textarea"
          placeholder={disabled ? "Connecting…" : "Message…"}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKey}
          rows={1}
          disabled={disabled}
        />
        <div className="input-actions">
          {/* Attach file */}
          <button
            className={`ia-btn${uploading ? " uploading" : ""}`}
            onClick={() => !uploading && fileInputRef.current?.click()}
            title="Attach file"
            disabled={disabled || uploading}
          >
            {uploading ? (
              <span className="spinner" />
            ) : (
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            )}
          </button>
          {/* Send */}
          <button
            className="ia-btn send"
            onClick={handleSend}
            disabled={!text.trim() || disabled}
            title="Send"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
