import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (accessToken: string, refreshToken?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setAccessToken(token);
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    isAuthenticated: !!accessToken,
    accessToken,
    login: (token: string, refreshToken?: string) => {
      // Persist tokens
      localStorage.setItem("accessToken", token);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      setAccessToken(token);

      // Clear any cached client data from previous sessions/users
      // so a new user doesn't see old users' data
      const staleKeys = [
        "goals",
        "focusDuration",
        "shortBreak",
        "longBreak",
        "longBreakEvery",
        "refocus_goals",
      ];
      staleKeys.forEach((k) => localStorage.removeItem(k));
    },
    logout: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // Also clear client-side cached data on logout
      const staleKeys = [
        "goals",
        "focusDuration",
        "shortBreak",
        "longBreak",
        "longBreakEvery",
        "refocus_goals",
      ];
      staleKeys.forEach((k) => localStorage.removeItem(k));
      setAccessToken(null);
      navigate("/login");
    },
  }), [accessToken, navigate]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
