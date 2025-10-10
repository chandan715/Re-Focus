const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export async function authFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const access = localStorage.getItem("accessToken");
  const headers = new Headers(init?.headers || {});
  if (access) headers.set("Authorization", `Bearer ${access}`);

  const doFetch = async () => fetch(input, { ...init, headers });

  let res = await doFetch();
  if (res.status !== 401) return res;

  // Try to refresh token
  const refresh = localStorage.getItem("refreshToken");
  if (!refresh) return res;

  try {
    const refreshRes = await fetch(`${API_BASE}/api/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!refreshRes.ok) {
      // Clear tokens if refresh failed
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return res;
    }
    const data = await refreshRes.json();
    if (data.access) {
      localStorage.setItem("accessToken", data.access);
      // Update header and retry original request once
      headers.set("Authorization", `Bearer ${data.access}`);
      res = await doFetch();
    }
    return res;
  } catch (_) {
    return res;
  }
}
