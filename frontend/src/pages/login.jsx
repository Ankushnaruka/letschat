import React, { useState } from "react";

function Login({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // Only for signup
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (mode === "login") {
      try {
        const res = await fetch("http://localhost:8080/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (res.ok && data.token) {
          localStorage.setItem("token", data.token);
          if (onLogin) onLogin(data.token);
          navigate("/home"); // <-- Redirect to home after login
        } else {
          setError(data.message || "Login failed");
        }
      } catch (err) {
        setError("Network error");
      }
    }else {
      // Sign up
      try {
        const res = await fetch("http://localhost:8080/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, email }),
        });
        const data = await res.json();
        if (res.ok) {
          setMessage("Sign up successful! Please log in.");
          setMode("login");
          setUsername("");
          setPassword("");
          setEmail("");
        } else {
          setError(data.message || "Sign up failed");
        }
      } catch (err) {
        setError("Network error");
      }
    }
  };

  return (
    <div style={{ maxWidth: 340, margin: "60px auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit}>
        {mode === "signup" && (
          <div style={{ marginBottom: 12 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: 8 }}
            />
          </div>
        )}
        <div style={{ marginBottom: 12 }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
        {message && <div style={{ color: "green", marginBottom: 12 }}>{message}</div>}
        <button type="submit" style={{ width: "100%", padding: 10 }}>
          {mode === "login" ? "Login" : "Sign Up"}
        </button>
      </form>
      <div style={{ marginTop: 16, textAlign: "center" }}>
        {mode === "login" ? (
          <>
            Don't have an account?{" "}
            <button
              style={{ color: "blue", background: "none", border: "none", cursor: "pointer" }}
              onClick={() => { setMode("signup"); setError(""); setMessage(""); }}
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              style={{ color: "blue", background: "none", border: "none", cursor: "pointer" }}
              onClick={() => { setMode("login"); setError(""); setMessage(""); }}
            >
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;