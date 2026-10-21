const style = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-app:    #1a1d23;
    --bg-side:   #111318;
    --bg-panel:  #16191f;
    --bg-input:  #1f222a;
    --bg-hover:  #22262e;
    --bg-active: #282d38;
    --bg-bubble-them: #252a34;
    --bg-bubble-me:   #2f6af5;

    --border:    rgba(255,255,255,0.06);
    --border-strong: rgba(255,255,255,0.1);

    --text-primary:   #e8eaf0;
    --text-secondary: #8b93a6;
    --text-muted:     #505870;
    --text-on-accent: #ffffff;

    --accent:    #2f6af5;
    --accent-h:  #4d84ff;
    --danger:    #e05252;
    --success:   #3ecf8e;
    --warning:   #f0a44a;

    --radius-sm:  6px;
    --radius-md:  10px;
    --radius-lg:  14px;
    --radius-xl:  18px;

    --font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --mono: 'JetBrains Mono', monospace;

    --transition: 150ms ease;
    --shadow: 0 2px 8px rgba(0,0,0,0.4);
  }

  html, body, #root {
    height: 100%;
    background: var(--bg-app);
    font-family: var(--font);
    color: var(--text-primary);
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.14); }

  input, button { font-family: var(--font); }
  input::placeholder { color: var(--text-muted); }

  /* ===== LAYOUT ===== */
  .app { display: flex; height: 100vh; overflow: hidden; }
  .main { flex: 1; display: flex; flex-direction: column; min-width: 0; background: var(--bg-app); }

  /* ===== SIDEBAR ===== */
  .sidebar {
    width: 264px;
    min-width: 264px;
    background: var(--bg-side);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .sidebar-header {
    padding: 18px 16px 14px;
    border-bottom: 1px solid var(--border);
  }
  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
  }
  .sidebar-brand-icon {
    width: 32px; height: 32px;
    background: var(--accent);
    border-radius: var(--radius-md);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .sidebar-brand-name {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.3px;
    color: var(--text-primary);
  }
  .sidebar-brand-name span { color: var(--accent-h); }
  .ws-badge {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-family: var(--mono);
    font-weight: 500;
    padding: 3px 8px;
    border-radius: 20px;
    white-space: nowrap;
  }
  .ws-badge.connected { color: var(--success); background: rgba(62,207,142,0.1); }
  .ws-badge.connecting { color: var(--warning); background: rgba(240,164,74,0.1); }
  .ws-badge.disconnected { color: var(--danger); background: rgba(224,82,82,0.1); }
  .ws-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .ws-dot.connected { background: var(--success); }
  .ws-dot.connecting { background: var(--warning); animation: pulse 1.2s infinite; }
  .ws-dot.disconnected { background: var(--danger); }
  @keyframes pulse { 0%,100%{ opacity:1; } 50%{ opacity:0.4; } }

  .sidebar-user {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 7px 10px;
    background: var(--bg-hover);
    border-radius: var(--radius-md);
  }
  .user-avatar-sm {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }
  .user-name-sm {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sidebar-search {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
  }
  .search-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 8px 12px;
    transition: border-color var(--transition);
  }
  .search-wrap:focus-within { border-color: var(--accent); }
  .search-wrap svg { flex-shrink: 0; color: var(--text-muted); }
  .search-wrap input {
    background: none;
    border: none;
    outline: none;
    font-size: 13px;
    color: var(--text-primary);
    flex: 1;
  }

  .rooms-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px 6px;
  }
  .rooms-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-muted);
  }
  .rooms-add-btn {
    width: 22px; height: 22px;
    border: none;
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center;
    transition: color var(--transition), background var(--transition);
  }
  .rooms-add-btn:hover { color: var(--text-primary); background: var(--bg-hover); }

  .room-list {
    flex: 1;
    overflow-y: auto;
    padding: 4px 8px;
  }
  .room-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 10px;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background var(--transition);
    margin-bottom: 2px;
  }
  .room-item:hover { background: var(--bg-hover); }
  .room-item.active { background: var(--bg-active); }
  .room-icon {
    width: 34px; height: 34px;
    border-radius: var(--radius-sm);
    background: var(--bg-active);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700;
    color: var(--accent-h);
    flex-shrink: 0;
    border: 1px solid var(--border);
  }
  .room-item.active .room-icon { background: var(--accent); color: #fff; border-color: transparent; }
  .room-info { flex: 1; min-width: 0; }
  .room-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .room-meta {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 1px;
  }
  .rooms-empty {
    padding: 32px 16px;
    text-align: center;
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.6;
  }

  .sidebar-footer {
    padding: 10px 8px;
    border-top: 1px solid var(--border);
    display: flex;
    gap: 6px;
  }
  .footer-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 10px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition);
  }
  .footer-btn:hover { background: var(--bg-hover); color: var(--text-primary); border-color: var(--border-strong); }
  .footer-btn.danger:hover { color: var(--danger); border-color: rgba(224,82,82,0.3); background: rgba(224,82,82,0.08); }

  /* ===== CHAT HEADER ===== */
  .chat-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 20px;
    height: 56px;
    min-height: 56px;
    background: var(--bg-panel);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .ch-avatar {
    width: 36px; height: 36px;
    border-radius: var(--radius-md);
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }
  .ch-info { flex: 1; min-width: 0; }
  .ch-name { font-size: 15px; font-weight: 600; }
  .ch-meta { font-size: 12px; color: var(--text-muted); margin-top: 1px; }
  .ch-actions { display: flex; gap: 6px; }
  .ch-btn {
    padding: 6px 12px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--bg-hover);
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition);
    white-space: nowrap;
  }
  .ch-btn:hover { background: var(--bg-active); color: var(--text-primary); border-color: var(--border-strong); }
  .ch-btn.danger:hover { color: var(--danger); border-color: rgba(224,82,82,0.3); background: rgba(224,82,82,0.08); }
  .ch-btn.primary {
    background: var(--accent);
    border-color: transparent;
    color: #fff;
  }
  .ch-btn.primary:hover { background: var(--accent-h); }

  /* ===== MESSAGES ===== */
  .messages-area {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .load-more-trigger {
    height: 1px;
    flex-shrink: 0;
  }
  .load-more-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px;
    color: var(--text-muted);
    font-size: 12px;
    gap: 8px;
  }
  .spinner {
    width: 14px; height: 14px;
    border: 2px solid var(--border-strong);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .date-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 18px 0 10px;
    color: var(--text-muted);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.4px;
  }
  .date-divider::before, .date-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* Message grouping: consecutive messages from same sender lose the avatar/name except first */
  .msg-row {
    display: flex;
    align-items: flex-end;
    gap: 9px;
    padding: 1px 0;
    animation: msgIn 0.12s ease;
  }
  @keyframes msgIn { from { opacity:0; transform: translateY(4px); } to { opacity:1; transform: translateY(0); } }
  .msg-row.mine { flex-direction: row-reverse; }
  .msg-row.first { margin-top: 10px; }

  .msg-avatar {
    width: 30px; height: 30px;
    border-radius: 50%;
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700;
    color: #fff;
    align-self: flex-end;
  }
  .msg-avatar.placeholder { opacity: 0; pointer-events: none; }
  .msg-avatar.theirs { background: var(--bg-active); color: var(--text-secondary); }
  .msg-avatar.mine-av { background: var(--accent); }

  .msg-content { display: flex; flex-direction: column; gap: 2px; max-width: 72%; }
  .msg-row.mine .msg-content { align-items: flex-end; }

  .msg-sender-name {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    padding: 0 4px;
    margin-bottom: 2px;
  }

  .bubble {
    padding: 9px 14px;
    border-radius: var(--radius-xl);
    font-size: 14px;
    line-height: 1.55;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: anywhere;
    position: relative;
  }
  .bubble.theirs {
    background: var(--bg-bubble-them);
    border-bottom-left-radius: var(--radius-sm);
    color: var(--text-primary);
  }
  .bubble.mine {
    background: var(--bg-bubble-me);
    border-bottom-right-radius: var(--radius-sm);
    color: #fff;
  }
  /* Consecutive bubbles from same sender are closer together */
  .msg-row:not(.first) .bubble.theirs { border-top-left-radius: var(--radius-sm); }
  .msg-row:not(.first) .bubble.mine { border-top-right-radius: var(--radius-sm); }

  .bubble-time {
    font-size: 10px;
    opacity: 0.5;
    margin-top: 3px;
    font-family: var(--mono);
    text-align: right;
  }
  .bubble.theirs .bubble-time { text-align: left; }

  /* Media inside bubble */
  .msg-media {
    display: block;
    max-width: 100%;
    max-height: 320px;
    object-fit: contain;
    border-radius: var(--radius-md);
    margin-top: 6px;
    cursor: pointer;
  }
  .msg-file-link {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
    padding: 8px 12px;
    background: rgba(0,0,0,0.2);
    border-radius: var(--radius-md);
    text-decoration: none;
    color: inherit;
    font-size: 13px;
    transition: background var(--transition);
  }
  .msg-file-link:hover { background: rgba(0,0,0,0.35); }
  .msg-file-icon { font-size: 18px; flex-shrink: 0; }

  /* ===== INPUT AREA ===== */
  .input-area {
    padding: 12px 20px 16px;
    background: var(--bg-panel);
    border-top: 1px solid var(--border);
    flex-shrink: 0;
  }
  .input-wrap {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 8px 8px 8px 14px;
    transition: border-color var(--transition);
  }
  .input-wrap:focus-within { border-color: rgba(47,106,245,0.5); }
  .msg-textarea {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    resize: none;
    font-family: var(--font);
    font-size: 14px;
    color: var(--text-primary);
    line-height: 1.5;
    max-height: 160px;
    min-height: 24px;
    overflow-y: auto;
    padding: 2px 0;
  }
  .input-actions { display: flex; align-items: flex-end; gap: 4px; }
  .ia-btn {
    width: 36px; height: 36px;
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all var(--transition);
    flex-shrink: 0;
  }
  .ia-btn:hover { background: var(--bg-hover); color: var(--text-secondary); }
  .ia-btn.send {
    background: var(--accent);
    color: #fff;
  }
  .ia-btn.send:hover { background: var(--accent-h); }
  .ia-btn.send:disabled { opacity: 0.35; cursor: not-allowed; background: var(--bg-hover); }
  .ia-btn.uploading { opacity: 0.6; cursor: not-allowed; }
  .upload-progress {
    font-size: 11px;
    color: var(--text-muted);
    padding: 4px 4px 0;
    font-family: var(--mono);
  }

  /* ===== RIGHT PANEL ===== */
  .right-panel {
    width: 232px;
    min-width: 232px;
    background: var(--bg-panel);
    border-left: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .rp-head {
    padding: 20px 16px 16px;
    border-bottom: 1px solid var(--border);
    text-align: center;
  }
  .rp-avatar {
    width: 56px; height: 56px;
    border-radius: var(--radius-lg);
    background: var(--accent);
    margin: 0 auto 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; font-weight: 700;
    color: #fff;
  }
  .rp-name { font-size: 14px; font-weight: 700; }
  .rp-unique { font-size: 11px; color: var(--text-muted); font-family: var(--mono); margin-top: 2px; }

  .rp-section-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-muted);
    padding: 12px 16px 6px;
  }
  .rp-body { flex: 1; overflow-y: auto; }

  .member-row {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 6px 16px;
  }
  .member-av {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: var(--bg-active);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700;
    color: var(--text-secondary);
    flex-shrink: 0;
  }
  .member-name { font-size: 13px; font-weight: 500; flex: 1; }
  .badge-admin {
    font-size: 10px;
    font-weight: 600;
    padding: 1px 6px;
    border-radius: 4px;
    background: rgba(47,106,245,0.15);
    color: var(--accent-h);
    border: 1px solid rgba(47,106,245,0.25);
  }

  .rp-add-form {
    padding: 10px 16px 14px;
    border-top: 1px solid var(--border);
  }
  .rp-add-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-muted);
    margin-bottom: 8px;
  }
  .rp-add-row { display: flex; gap: 6px; }
  .rp-add-row input {
    flex: 1;
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 7px 10px;
    font-size: 12px;
    color: var(--text-primary);
    outline: none;
    transition: border-color var(--transition);
  }
  .rp-add-row input:focus { border-color: var(--accent); }
  .rp-add-row button {
    padding: 7px 12px;
    background: var(--accent);
    border: none;
    border-radius: var(--radius-md);
    font-size: 12px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    transition: background var(--transition);
    white-space: nowrap;
  }
  .rp-add-row button:hover { background: var(--accent-h); }
  .rp-add-row button:disabled { opacity: 0.5; cursor: not-allowed; }

  .rp-requests {
    padding: 8px 16px 14px;
    border-top: 1px solid var(--border);
  }
  .rp-req-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }
  .rp-req-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-muted);
  }
  .rp-req-btn {
    font-size: 11px;
    padding: 4px 10px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--bg-hover);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition);
  }
  .rp-req-btn:hover { background: var(--bg-active); color: var(--text-primary); }

  /* ===== AUTH ===== */
  .auth-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-app);
    min-height: 100vh;
  }
  .auth-card {
    background: var(--bg-panel);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 40px 36px;
    width: 400px;
    box-shadow: var(--shadow);
  }
  .auth-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
  }
  .auth-logo-icon {
    width: 36px; height: 36px;
    background: var(--accent);
    border-radius: var(--radius-md);
    display: flex; align-items: center; justify-content: center;
  }
  .auth-logo-name {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.5px;
  }
  .auth-logo-name span { color: var(--accent-h); }
  .auth-tagline {
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 28px;
    padding-left: 2px;
  }
  .auth-tabs {
    display: flex;
    gap: 0;
    background: var(--bg-input);
    border-radius: var(--radius-md);
    padding: 3px;
    margin-bottom: 24px;
    border: 1px solid var(--border);
  }
  .auth-tab {
    flex: 1;
    padding: 7px 12px;
    border: none;
    background: transparent;
    border-radius: calc(var(--radius-md) - 2px);
    font-size: 13px;
    font-weight: 500;
    color: var(--text-muted);
    cursor: pointer;
    transition: all var(--transition);
  }
  .auth-tab.active {
    background: var(--bg-active);
    color: var(--text-primary);
    box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  }
  .field { margin-bottom: 14px; }
  .field label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 6px;
  }
  .field input {
    width: 100%;
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 10px 13px;
    font-size: 14px;
    color: var(--text-primary);
    outline: none;
    transition: border-color var(--transition);
  }
  .field input:focus { border-color: var(--accent); }
  .btn-primary {
    width: 100%;
    padding: 11px;
    background: var(--accent);
    border: none;
    border-radius: var(--radius-md);
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    transition: background var(--transition);
    margin-top: 6px;
  }
  .btn-primary:hover { background: var(--accent-h); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .err-msg {
    font-size: 12px;
    color: var(--danger);
    background: rgba(224,82,82,0.08);
    border: 1px solid rgba(224,82,82,0.2);
    border-radius: var(--radius-md);
    padding: 8px 12px;
    margin-top: 10px;
  }

  /* ===== MODAL ===== */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.55);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
  }
  .modal {
    background: var(--bg-panel);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 28px;
    width: 380px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  }
  .modal-title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 20px;
  }
  .modal-actions { display: flex; gap: 8px; margin-top: 18px; }
  .btn-ghost {
    flex: 1;
    padding: 10px;
    background: var(--bg-hover);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition);
  }
  .btn-ghost:hover { background: var(--bg-active); color: var(--text-primary); }

  /* ===== EMPTY STATE ===== */
  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--text-muted);
    padding: 40px;
    text-align: center;
  }
  .empty-icon {
    width: 64px; height: 64px;
    border-radius: var(--radius-xl);
    background: var(--bg-hover);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 4px;
  }
  .empty-title { font-size: 16px; font-weight: 600; color: var(--text-secondary); }
  .empty-sub { font-size: 13px; line-height: 1.6; max-width: 240px; }

  /* ===== TOAST ===== */
  .toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 11px 16px;
    border-radius: var(--radius-lg);
    font-size: 13px;
    font-weight: 500;
    z-index: 999;
    animation: toastIn 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    max-width: 300px;
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
    background: var(--bg-active);
    color: var(--text-primary);
  }
  .toast::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .toast.success::before { background: var(--success); }
  .toast.error::before { background: var(--danger); }
  @keyframes toastIn { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }
`;

export default style;
