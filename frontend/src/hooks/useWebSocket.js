import { useRef, useState, useCallback, useEffect } from "react";

function isJwtExpired(token) {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return true;
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

const resolveWsUrl = () => {
  const configured = (import.meta.env.VITE_WS_URL || "").trim();
  if (!configured) {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    return `${protocol}://${window.location.host}`;
  }

  try {
    const url = new URL(configured);
    url.pathname = "/";
    url.search = "";
    return url.toString();
  } catch {
    return configured.replace(/\/ws\/?$/i, "");
  }
};

const WS_URL = resolveWsUrl();

export function useWebSocket(token, onMessage) {
  const ws = useRef(null);
  const reconnectTimer = useRef(null);
  const [status, setStatus] = useState("disconnected");

  const connect = useCallback(
    (tok) => {
      if (!tok || isJwtExpired(tok)) {
        setStatus("disconnected");
        return;
      }
      if (ws.current && ws.current.readyState < 2) ws.current.close();
      clearTimeout(reconnectTimer.current);
      setStatus("connecting");

      const wsUrl = `${WS_URL}?token=${encodeURIComponent(tok)}`;
      const sock = new WebSocket(wsUrl);
      ws.current = sock;

      sock.onopen = () => {
        setStatus("connected");
      };

      sock.onclose = (event) => {
        setStatus("disconnected");

        const reason = event.reason || "";
        const isAuthFailure = /invalid token|authentication required|401|4002|4003/i.test(reason);
        if (!isAuthFailure) {
          reconnectTimer.current = setTimeout(() => connect(tok), 6000);
        }
      };

      sock.onerror = () => setStatus("disconnected");

      sock.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg.roomID || msg._id) onMessage(msg);
        } catch {}
      };
    },
    [onMessage]
  );

  useEffect(() => {
    if (token) connect(token);
    return () => {
      clearTimeout(reconnectTimer.current);
      ws.current?.close();
    };
  }, [token, connect]);

  const send = useCallback((data) => {
    if (ws.current?.readyState === 1) {
      ws.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, []);

  return { status, send };
}
