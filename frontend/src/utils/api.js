const API = import.meta.env.VITE_API_URL;

export const api = async (path, opts = {}, token = null) => {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...opts.headers,
  };
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};
