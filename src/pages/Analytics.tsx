import React, { useEffect, useState } from "react";
import { authFetch } from "@/lib/authFetch";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

type Stats = {
  today_minutes: number;
  weekly_minutes: number;
  total_goals: number;
  completed_goals: number;
  current_streak: number;
  longest_streak: number;
  total_study_days: number;
};

const Analytics: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Please log in to view analytics.");
      setLoading(false);
      return;
    }
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await authFetch(`${API_BASE}/api/dashboard/stats/`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Failed: ${res.status}`);
        }
        const json = (await res.json()) as Stats;
        setStats(json);
      } catch (e: any) {
        setError(e.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div className="container py-20">
      <h1 className="text-3xl font-bold mb-4">Progress Analytics</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded border p-4">
            <div className="text-sm text-muted-foreground">Today Minutes</div>
            <div className="text-2xl font-semibold">{stats.today_minutes}</div>
          </div>
          <div className="rounded border p-4">
            <div className="text-sm text-muted-foreground">Weekly Minutes</div>
            <div className="text-2xl font-semibold">{stats.weekly_minutes}</div>
          </div>
          <div className="rounded border p-4">
            <div className="text-sm text-muted-foreground">Total Goals</div>
            <div className="text-2xl font-semibold">{stats.total_goals}</div>
          </div>
          <div className="rounded border p-4">
            <div className="text-sm text-muted-foreground">Completed Goals</div>
            <div className="text-2xl font-semibold">{stats.completed_goals}</div>
          </div>
          <div className="rounded border p-4">
            <div className="text-sm text-muted-foreground">Current Streak</div>
            <div className="text-2xl font-semibold">{stats.current_streak}</div>
          </div>
          <div className="rounded border p-4">
            <div className="text-sm text-muted-foreground">Longest Streak</div>
            <div className="text-2xl font-semibold">{stats.longest_streak}</div>
          </div>
          <div className="rounded border p-4 md:col-span-3">
            <div className="text-sm text-muted-foreground">Total Study Days</div>
            <div className="text-2xl font-semibold">{stats.total_study_days}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;