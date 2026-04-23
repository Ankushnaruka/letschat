import { useState } from "react";
import { api } from "../utils/api";

export default function AuthScreen({ onAuth }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setErr("");
    setLoading(true);
    try {
      let data;
      if (tab === "login") {
        data = await api("/auth/login", {
          method: "POST",
          body: { username: form.username, password: form.password },
        });
      } else {
        data = await api("/auth/signup", { method: "POST", body: form });
      }
      onAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userId: data.userId,
        username: form.username,
      });
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-bg" />
      <div className="auth-card">
        <div className="auth-logo">
          Lets<span>Chat</span>
        </div>
        <div className="auth-sub">Connect. Chat. Collaborate.</div>
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === "login" ? "active" : ""}`}
            onClick={() => setTab("login")}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${tab === "signup" ? "active" : ""}`}
            onClick={() => setTab("signup")}
          >
            Create Account
          </button>
        </div>
        <div className="field">
          <label>Username</label>
          <input
            value={form.username}
            onChange={set("username")}
            placeholder="john_doe"
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
        {tab === "signup" && (
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="john@example.com"
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>
        )}
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={set("password")}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
        <button className="btn-primary" onClick={submit} disabled={loading}>
          {loading ? "Please wait…" : tab === "login" ? "Sign In" : "Create Account"}
        </button>
        {err && <div className="err-msg">{err}</div>}
      </div>
    </div>
  );
}
