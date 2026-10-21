export default function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)" strokeWidth="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <div className="empty-title">No room selected</div>
      <div className="empty-sub">
        Pick a room from the sidebar to start chatting, or create a new one.
      </div>
    </div>
  );
}
