const style = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg0: #070d1a;
    --bg1: #0b1425;
    --bg2: #0f1d33;
    --bg3: #162540;
    --bg4: #1e3050;
    --accent: #3b82f6;
    --accent2: #60a5fa;
    --accent-glow: rgba(59,130,246,0.25);
    --text0: #f0f6ff;
    --text1: #a8c0dc;
    --text2: #5a7a9e;
    --border: rgba(255,255,255,0.07);
    --radius: 16px;
    --font: 'Sora', sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }
  html, body, #root { height: 100%; background: var(--bg0); font-family: var(--font); color: var(--text0); }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--bg4); border-radius: 4px; }

  .app { display: flex; height: 100vh; overflow: hidden; }

  /* AUTH */
  .auth-wrap { flex: 1; display: flex; align-items: center; justify-content: center; background: var(--bg0); position: relative; overflow: hidden; }
  .auth-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%); pointer-events: none; }
  .auth-card { background: var(--bg1); border: 1px solid var(--border); border-radius: 24px; padding: 48px 44px; width: 420px; position: relative; z-index: 1; }
  .auth-logo { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 8px; }
  .auth-logo span { color: var(--accent2); }
  .auth-sub { font-size: 13px; color: var(--text2); margin-bottom: 36px; }
  .auth-tabs { display: flex; gap: 4px; background: var(--bg2); border-radius: 12px; padding: 4px; margin-bottom: 28px; }
  .auth-tab { flex: 1; padding: 8px; border: none; background: transparent; border-radius: 9px; font-family: var(--font); font-size: 13px; font-weight: 500; color: var(--text2); cursor: pointer; transition: all 0.2s; }
  .auth-tab.active { background: var(--bg4); color: var(--text0); }
  .field { margin-bottom: 16px; }
  .field label { display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text2); margin-bottom: 6px; }
  .field input { width: 100%; background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 11px 14px; font-family: var(--font); font-size: 14px; color: var(--text0); outline: none; transition: border 0.2s; }
  .field input:focus { border-color: var(--accent); }
  .btn-primary { width: 100%; padding: 12px; background: var(--accent); border: none; border-radius: 10px; font-family: var(--font); font-size: 14px; font-weight: 600; color: #fff; cursor: pointer; transition: opacity 0.2s, transform 0.1s; margin-top: 4px; }
  .btn-primary:hover { opacity: 0.88; }
  .btn-primary:active { transform: scale(0.99); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .err-msg { font-size: 12px; color: #f87171; background: rgba(248,113,113,0.1); border-radius: 8px; padding: 8px 12px; margin-top: 12px; }

  /* SIDEBAR */
  .sidebar { width: 280px; min-width: 280px; background: var(--bg1); border-right: 1px solid var(--border); display: flex; flex-direction: column; }
  .sidebar-header { padding: 20px 20px 12px; border-bottom: 1px solid var(--border); }
  .sidebar-logo { font-size: 18px; font-weight: 700; letter-spacing: -0.3px; display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
  .sidebar-logo span { color: var(--accent2); }
  .sidebar-user { font-size: 12px; color: var(--text2); font-family: var(--mono); }
  .search-box { background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 9px 12px; display: flex; align-items: center; gap: 8px; }
  .search-box input { background: none; border: none; outline: none; font-family: var(--font); font-size: 13px; color: var(--text0); flex: 1; }
  .sidebar-section { padding: 16px 20px 8px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: var(--text2); display: flex; align-items: center; justify-content: space-between; }
  .room-list { flex: 1; overflow-y: auto; padding: 0 10px 10px; }
  .room-item { padding: 10px 12px; border-radius: 10px; cursor: pointer; transition: background 0.15s; display: flex; align-items: center; gap: 10px; }
  .room-item:hover { background: var(--bg2); }
  .room-item.active { background: var(--bg3); }
  .room-avatar { width: 36px; height: 36px; border-radius: 10px; background: var(--bg4); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: var(--accent2); flex-shrink: 0; }
  .room-info { flex: 1; min-width: 0; }
  .room-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .room-preview { font-size: 11px; color: var(--text2); }
  .sidebar-actions { padding: 12px 16px; border-top: 1px solid var(--border); display: flex; gap: 8px; }
  .icon-btn { flex: 1; padding: 9px; background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; font-size: 12px; font-weight: 500; color: var(--text1); cursor: pointer; font-family: var(--font); transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 5px; }
  .icon-btn:hover { background: var(--bg3); color: var(--text0); }
  .icon-btn.danger:hover { background: rgba(239,68,68,0.15); color: #f87171; border-color: rgba(239,68,68,0.3); }

  /* MAIN */
  .main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
  .chat-header { padding: 16px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; background: var(--bg1); }
  .chat-header-avatar { width: 40px; height: 40px; border-radius: 12px; background: var(--bg4); display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; color: var(--accent2); }
  .chat-header-name { font-size: 16px; font-weight: 600; }
  .chat-header-meta { font-size: 12px; color: var(--text2); }
  .chat-header-right { margin-left: auto; display: flex; gap: 6px; }
  .h-btn { padding: 7px 12px; background: var(--bg2); border: 1px solid var(--border); border-radius: 8px; font-size: 12px; font-weight: 500; color: var(--text1); cursor: pointer; font-family: var(--font); transition: all 0.15s; }
  .h-btn:hover { background: var(--bg3); color: var(--text0); }
  .h-btn.danger:hover { background: rgba(239,68,68,0.1); color: #f87171; }
  .messages-area { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 2px; }
  .date-divider { text-align: center; font-size: 11px; color: var(--text2); font-weight: 500; letter-spacing: 0.5px; padding: 16px 0 8px; display: flex; align-items: center; gap: 12px; }
  .date-divider::before, .date-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .msg-row { display: flex; align-items: flex-end; gap: 10px; margin-bottom: 8px; }
  .msg-row.mine { flex-direction: row-reverse; }
  .msg-content { display: flex; flex-direction: column; gap: 2px; }
  .msg-avatar { width: 28px; height: 28px; border-radius: 8px; background: var(--bg4); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: var(--accent2); }
  .bubble { max-width: 62%; padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.5; }
  .bubble.theirs { background: var(--bg3); border-bottom-left-radius: 5px; }
  .bubble.mine { background: var(--accent); border-bottom-right-radius: 5px; }
  .bubble-time { font-size: 10px; color: rgba(255,255,255,0.45); margin-top: 4px; text-align: right; font-family: var(--mono); }
  .bubble.theirs .bubble-time { color: var(--text2); text-align: left; }
  .msg-sender { font-size: 11px; color: var(--text2); margin-bottom: 3px; font-weight: 500; }
  .input-area { padding: 16px 24px; border-top: 1px solid var(--border); background: var(--bg1); display: flex; align-items: center; gap: 10px; }
  .plus-btn { width: 40px; height: 40px; border-radius: 12px; background: var(--accent); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; transition: opacity 0.15s; }
  .plus-btn:hover { opacity: 0.85; }
  .msg-input { flex: 1; background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 11px 16px; font-family: var(--font); font-size: 14px; color: var(--text0); outline: none; transition: border 0.2s; }
  .msg-input:focus { border-color: var(--accent); }
  .send-btn { width: 40px; height: 40px; border-radius: 12px; background: var(--accent); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; transition: opacity 0.15s; }
  .send-btn:hover { opacity: 0.85; }
  .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* RIGHT PANEL */
  .right-panel { width: 240px; min-width: 240px; background: var(--bg1); border-left: 1px solid var(--border); display: flex; flex-direction: column; }
  .rp-header { padding: 20px 18px 14px; border-bottom: 1px solid var(--border); }
  .rp-avatar { width: 64px; height: 64px; border-radius: 18px; background: var(--bg4); margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; color: var(--accent2); }
  .rp-name { text-align: center; font-size: 15px; font-weight: 600; margin-bottom: 2px; }
  .rp-uniq { text-align: center; font-size: 11px; color: var(--text2); font-family: var(--mono); }
  .rp-section { padding: 14px 18px 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: var(--text2); }
  .member-item { padding: 7px 18px; display: flex; align-items: center; gap: 9px; font-size: 13px; }
  .member-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--bg4); flex-shrink: 0; }
  .badge-admin { font-size: 10px; font-weight: 600; background: rgba(59,130,246,0.2); color: var(--accent2); border: 1px solid rgba(59,130,246,0.3); border-radius: 5px; padding: 1px 6px; margin-left: auto; }

  /* EMPTY STATE */
  .empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text2); gap: 10px; }
  .empty-state svg { opacity: 0.3; }
  .empty-title { font-size: 16px; font-weight: 600; color: var(--text1); }
  .empty-sub { font-size: 13px; }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(4px); }
  .modal { background: var(--bg1); border: 1px solid var(--border); border-radius: 20px; padding: 32px; width: 380px; }
  .modal-title { font-size: 17px; font-weight: 700; margin-bottom: 20px; }
  .modal-actions { display: flex; gap: 10px; margin-top: 20px; }
  .btn-ghost { flex: 1; padding: 10px; background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; font-family: var(--font); font-size: 13px; font-weight: 500; color: var(--text1); cursor: pointer; }
  .btn-ghost:hover { background: var(--bg3); }

  /* TOAST */
  .toast { position: fixed; bottom: 24px; right: 24px; background: var(--bg3); border: 1px solid var(--border); border-radius: 12px; padding: 12px 18px; font-size: 13px; font-weight: 500; z-index: 200; animation: slideUp 0.3s ease; max-width: 300px; }
  .toast.success { border-color: rgba(34,197,94,0.4); color: #86efac; }
  .toast.error { border-color: rgba(239,68,68,0.4); color: #fca5a5; }
  @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .connecting { font-size: 11px; color: var(--accent2); font-family: var(--mono); padding: 4px 8px; background: var(--accent-glow); border-radius: 6px; }
  .offline { font-size: 11px; color: #f87171; font-family: var(--mono); padding: 4px 8px; background: rgba(239,68,68,0.1); border-radius: 6px; }
  input::placeholder { color: var(--text2); }
`;

export default style;
