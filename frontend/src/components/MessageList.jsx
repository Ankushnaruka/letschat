import { useRef, useEffect } from "react";
import { groupByDate, fmtTime } from "../utils/helpers";

export default function MessageList({ messages, username, userId }) {
  const bottomRef = useRef(null);
  const grouped = groupByDate(messages);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messages-area">
      {grouped.map((item, i) => {
        if (item.type === "date") {
          return (
            <div key={i} className="date-divider">
              {item.label}
            </div>
          );
        }

        const mine =
          item._mine ||
          item.sender?._id === userId ||
          item.sender?.username === username;

        return (
          <div key={item._id || i} className={`msg-row ${mine ? "mine" : ""}`}>
            {!mine && (
              <div className="msg-avatar">
                {item.sender?.username?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <div className="msg-content">
              {!mine && (
                <div className="msg-sender">{item.sender?.username}</div>
              )}
              <div className={`bubble ${mine ? "mine" : "theirs"}`}>
                {item.text}
                <div className="bubble-time">
                  {fmtTime(item.createdAt || item.time)}
                </div>
              </div>
            </div>
            {mine && (
              <div
                className="msg-avatar"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                {username?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
