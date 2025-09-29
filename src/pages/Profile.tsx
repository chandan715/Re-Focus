import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

interface ProfileData {
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    date_joined: string;
  };
  bio?: string;
}

const Profile: React.FC = () => {
  const { accessToken } = useAuth();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/profile/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Failed: ${res.status}`);
        }
        const json = await res.json();
        setData(json);
      } catch (e: any) {
        setError(e.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [accessToken]);

  if (loading) return <div className="container py-8">Loading profile...</div>;
  if (error) return <div className="container py-8 text-red-500">{error}</div>;
  if (!data) return <div className="container py-8">No profile data.</div>;

  const { user } = data;

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <div className="space-y-2">
        <div><span className="font-medium">Username:</span> {user.username}</div>
        <div><span className="font-medium">Email:</span> {user.email || "-"}</div>
        <div><span className="font-medium">Name:</span> {user.first_name || user.last_name ? `${user.first_name} ${user.last_name}` : "-"}</div>
        <div><span className="font-medium">Joined:</span> {new Date(user.date_joined).toLocaleString()}</div>
      </div>
    </div>
  );
};

export default Profile;
