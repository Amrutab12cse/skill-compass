import { useEffect, useState, useCallback } from "react";

// Lightweight auth + theme hooks backed by localStorage. No backend required.

const AUTH_KEY = "sga:auth";

export type AuthUser = { email: string; guest: boolean } | null;

export function useAuth() {
  const [user, setUser] = useState<AuthUser>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(AUTH_KEY) : null;
    setUser(raw ? JSON.parse(raw) : null);
    setReady(true);
  }, []);

  const login = useCallback((email: string) => {
    const u = { email, guest: false };
    localStorage.setItem(AUTH_KEY, JSON.stringify(u));
    setUser(u);
  }, []);

  const guest = useCallback(() => {
    const u = { email: "guest@skillgap.app", guest: true };
    localStorage.setItem(AUTH_KEY, JSON.stringify(u));
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, []);

  return { user, ready, login, guest, logout };
}

const THEME_KEY = "sga:theme";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = (localStorage.getItem(THEME_KEY) as "light" | "dark" | null) ?? "dark";
    setTheme(stored);
    document.documentElement.classList.toggle("dark", stored === "dark");
  }, []);

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  }, []);

  return { theme, toggle };
}
