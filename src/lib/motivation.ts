import { authFetch } from "@/lib/authFetch";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export async function startMotivationEmails({ goal_label, interval_minutes = 60 }: { goal_label: string; interval_minutes?: number; }) {
  const res = await authFetch(`${API_BASE}/api/motivation/start/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ goal_label, interval_minutes }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function stopMotivationEmails({ goal_label }: { goal_label: string; }) {
  const res = await authFetch(`${API_BASE}/api/motivation/stop/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ goal_label }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
