const API = import.meta.env.VITE_API_URL || "https://letschat-1-8pfq.onrender.com/api";

let refreshRequest = null;

function getStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem("letschat-auth") || "null");
  } catch {
    return null;
  }
}

function notifyAuthInvalid() {
  window.dispatchEvent(new Event("letschat:auth-invalid"));
}

export function refreshSession(auth = getStoredAuth()) {
  if (refreshRequest) return refreshRequest;

  refreshRequest = (async () => {
    if (!auth?.refreshToken) {
      const error = new Error("Refresh token is missing");
      error.status = 401;
      notifyAuthInvalid();
      throw error;
    }

    const response = await fetch(`${API}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
      headers: { Authorization: `Bearer ${auth.refreshToken}` },
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || "Could not refresh session");
      error.status = response.status;
      if ([400, 401, 403].includes(response.status)) notifyAuthInvalid();
      throw error;
    }

    const nextAuth = {
      ...auth,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken || auth.refreshToken,
    };
    localStorage.setItem("letschat-auth", JSON.stringify(nextAuth));
    window.dispatchEvent(new CustomEvent("letschat:auth-updated", { detail: nextAuth }));
    return nextAuth;
  })();

  const currentRequest = refreshRequest;
  return currentRequest.finally(() => {
    if (refreshRequest === currentRequest) refreshRequest = null;
  });
}

export const api = async (path, opts = {}, token = null, retried = false) => {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...opts.headers,
  };
  const res = await fetch(`${API}${path}`, {
    ...opts,
    credentials: "include",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  if (res.status === 401 && token && !retried) {
    const storedAuth = getStoredAuth();
    if (storedAuth?.refreshToken) {
      try {
        // Another request may already have refreshed the token.
        const nextAuth = storedAuth.accessToken !== token
          ? storedAuth
          : await refreshSession(storedAuth);
        return api(path, opts, nextAuth.accessToken, true);
      } catch {
        // Preserve the original request error; the auth-invalid event clears
        // the session when the refresh token itself is rejected.
      }
    }
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};
