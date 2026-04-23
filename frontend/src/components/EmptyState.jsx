export default function EmptyState() {
  return (
    <div className="empty-state">
      <svg
        width="64"
        height="64"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      <div className="empty-title">Select a room to start chatting</div>
      <div className="empty-sub">Or create a new room from the sidebar</div>
    </div>
  );
}
