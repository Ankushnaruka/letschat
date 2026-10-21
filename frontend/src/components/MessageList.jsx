import { useRef, useEffect, useCallback } from "react";
import { groupByDate, fmtTime } from "../utils/helpers";

function isImage(url) {
  if (!url) return false;
  const u = url.toLowerCase().split("?")[0];
  return /\.(jpg|jpeg|png|gif|webp|avif|svg|bmp)$/.test(u);
}

function isVideo(url) {
  if (!url) return false;
  const u = url.toLowerCase().split("?")[0];
  return /\.(mp4|webm|ogg|mov)$/.test(u);
}

function getFileName(url) {
  try {
    const parts = new URL(url).pathname.split("/");
    return decodeURIComponent(parts[parts.length - 1] || "file");
  } catch {
    return "file";
  }
}

function fileIcon(url) {
  if (!url) return "📎";
  const u = url.toLowerCase();
  if (u.includes(".pdf")) return "📄";
  if (u.includes(".zip") || u.includes(".rar")) return "🗜️";
  if (u.includes(".doc")) return "📝";
  if (u.includes(".mp4") || u.includes(".webm") || u.includes(".mov")) return "🎬";
  return "📎";
}

export default function MessageList({ messages, username, userId, onLoadMore, hasMore, loadingMore }) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);
  const prevScrollHeight = useRef(0);
  const isFirstLoad = useRef(true);

  // Scroll to bottom on initial load / new message arrives
  useEffect(() => {
    if (isFirstLoad.current) {
      bottomRef.current?.scrollIntoView({ behavior: "instant" });
      isFirstLoad.current = false;
      return;
    }
    // If user is near bottom, scroll to bottom on new message
    const el = containerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom < 120) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // After loading more, restore scroll position so content doesn't jump
  useEffect(() => {
    if (!loadingMore) {
      const el = containerRef.current;
      if (el && prevScrollHeight.current) {
        el.scrollTop = el.scrollHeight - prevScrollHeight.current;
        prevScrollHeight.current = 0;
      }
    }
  }, [loadingMore]);

  // Infinite scroll upwards: trigger load when user scrolls near top
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el || loadingMore || !hasMore) return;
    if (el.scrollTop < 80) {
      prevScrollHeight.current = el.scrollHeight;
      onLoadMore?.();
    }
  }, [loadingMore, hasMore, onLoadMore]);

  const grouped = groupByDate(messages);

  // Build sender groups for compact consecutive bubbles
  let lastSender = null;
  let lastType = null; // 'mine' or 'theirs'

  return (
    <div className="messages-area" ref={containerRef} onScroll={handleScroll}>
      {/* Top sentinel */}
      {hasMore && (
        <div className="load-more-spinner">
          {loadingMore ? (
            <>
              <span className="spinner" />
              <span>Loading older messages…</span>
            </>
          ) : (
            <span style={{ color: "var(--text-muted)", fontSize: 11 }}>Scroll up for more</span>
          )}
        </div>
      )}

      {grouped.map((item, i) => {
        if (item.type === "date") {
          lastSender = null;
          return (
            <div key={`d-${i}`} className="date-divider">
              {item.label}
            </div>
          );
        }

        const mine =
          item._mine ||
          item.sender?._id === userId ||
          item.sender?.username === username;

        const senderKey = item.sender?._id || item.sender?.username || "unknown";
        const currentType = mine ? "mine" : "theirs";
        const isFirst = senderKey !== lastSender || currentType !== lastType;
        lastSender = senderKey;
        lastType = currentType;

        const senderInitial = mine
          ? username?.[0]?.toUpperCase()
          : item.sender?.username?.[0]?.toUpperCase() || "?";

        const senderName = item.sender?.username || "?";

        return (
          <div
            key={item._id || i}
            className={`msg-row${mine ? " mine" : ""}${isFirst ? " first" : ""}`}
          >
            {/* Avatar */}
            {mine ? (
              <div className={`msg-avatar mine-av${!isFirst ? " placeholder" : ""}`}>
                {isFirst ? senderInitial : ""}
              </div>
            ) : (
              <div className={`msg-avatar theirs${!isFirst ? " placeholder" : ""}`}>
                {isFirst ? senderInitial : ""}
              </div>
            )}

            <div className="msg-content">
              {/* Sender name (only for first in group, for others' messages) */}
              {!mine && isFirst && (
                <div className="msg-sender-name">{senderName}</div>
              )}

              <div className={`bubble ${mine ? "mine" : "theirs"}`}>
                {/* Text */}
                {item.text && <span>{item.text}</span>}

                {/* Media */}
                {item.media && isImage(item.media) && (
                  <img
                    className="msg-media"
                    src={item.media}
                    alt="attachment"
                    loading="lazy"
                    onClick={() => window.open(item.media, "_blank")}
                  />
                )}
                {item.media && isVideo(item.media) && (
                  <video
                    className="msg-media"
                    src={item.media}
                    controls
                    preload="metadata"
                  />
                )}
                {item.media && !isImage(item.media) && !isVideo(item.media) && (
                  <a
                    className="msg-file-link"
                    href={item.media}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <span className="msg-file-icon">{fileIcon(item.media)}</span>
                    <span>{getFileName(item.media)}</span>
                  </a>
                )}

                <div className="bubble-time">
                  {fmtTime(item.createdAt || item.time)}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}
