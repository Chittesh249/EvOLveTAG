/**
 * Auth context: token, user, login, logout. Listens for auth-logout from API client.
 */
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authApi, profileApi } from "../api/services";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await profileApi.get();
      if (res.success && res.data) setUser(res.data);
      else setUser(null);
    } catch {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    const onLogout = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener("auth-logout", onLogout);
    return () => window.removeEventListener("auth-logout", onLogout);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authApi.login(email, password);
    if (res.success && res.token) {
      localStorage.setItem("token", res.token);
      setToken(res.token);
      setUser(res.data ?? null);
      return { success: true, user: res.data };
    }
    return { success: false, message: res.message || "Login failed" };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  const isAdmin = user?.role === "ADMIN";

  const value = {
    token,
    user,
    loading,
    login,
    logout,
    isAdmin,
    refreshUser: loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
