import { useRef, useState, useCallback, useEffect } from "react";

const WS_URL = import.meta.env.VITE_WS_URL;

export function useWebSocket(token, onMessage) {
  const ws = useRef(null);
  const reconnectTimer = useRef(null);
  const [status, setStatus] = useState("disconnected");

  const connect = useCallback(
    (tok) => {
      if (ws.current && ws.current.readyState < 2) ws.current.close();
      clearTimeout(reconnectTimer.current);
      setStatus("connecting");

      const wsUrl = `${WS_URL}?token=${tok}`;
      const sock = new WebSocket(wsUrl);
      ws.current = sock;

      sock.onopen = () => {
        setStatus("connected");
      };

      sock.onclose = () => {
        setStatus("disconnected");
        reconnectTimer.current = setTimeout(() => connect(tok), 6000);
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
