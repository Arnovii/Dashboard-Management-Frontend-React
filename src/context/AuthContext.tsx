// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/auth/auth.axios";

export type User = {
  username: string;
  correo: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  logout: (redirect?: boolean) => void;
  tokenValid: () => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* --- Helpers JWT --- */
function parseJwt(token: string | null) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(decoded)));
  } catch {
    return null;
  }
}

function isTokenExpired(token: string | null) {
  if (!token) return true;
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;
  const expMs = payload.exp * 1000;
  return Date.now() >= expMs;
}

const LS_TOKEN_KEY = "swk_token";
const LS_USER_KEY = "swk_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const logoutTimerRef = useRef<number | null>(null);

  const [token, setToken] = useState<string | null>(() => {
    try {
      const t = localStorage.getItem(LS_TOKEN_KEY);
      if (t && !isTokenExpired(t)) return t;
      localStorage.removeItem(LS_TOKEN_KEY);
      localStorage.removeItem(LS_USER_KEY);
      return null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const u = localStorage.getItem(LS_USER_KEY);
      if (!u) return null;
      return JSON.parse(u) as User;
    } catch {
      return null;
    }
  });

  // auto logout
  useEffect(() => {
    if (logoutTimerRef.current) {
      window.clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    if (token) {
      const payload = parseJwt(token);
      if (payload?.exp) {
        const expMs = payload.exp * 1000;
        const msUntil = expMs - Date.now();
        if (msUntil <= 0) {
          doLogout(false);
        } else {
          logoutTimerRef.current = window.setTimeout(() => {
            doLogout(true);
          }, msUntil);
        }
      }
    }

    return () => {
      if (logoutTimerRef.current) {
        window.clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
    };
  }, [token]);

  // evento global
  useEffect(() => {
    const handler = () => {
      doLogout(false);
    };
    window.addEventListener("swk_logout", handler);
    return () => window.removeEventListener("swk_logout", handler);
  }, []);

  const doLogout = (redirect = true) => {
    try {
      localStorage.removeItem(LS_TOKEN_KEY);
      localStorage.removeItem(LS_USER_KEY);
    } catch {}

    setToken(null);
    setUser(null);

    if (logoutTimerRef.current) {
      window.clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    if (redirect) {
      navigate("/login", { replace: true });
    }
  };

const login = async (emailOrUsername: string, password: string) => {
  // Body CORRECTO según tu API
  const credentials = { identifier: emailOrUsername, password };

  try {
    // Debug: qué se va a enviar
    console.log("%c[AUTH] - LOGIN REQUEST", "color: #0a66c2; font-weight: bold");
    console.log("→ Endpoint:", `${api.defaults.baseURL}/auth/login`);
    console.log("→ Payload:", credentials);

    const res = await api.post("/auth/login", credentials);

    // Debug: qué responde el servidor
    console.log("%c[AUTH] - LOGIN RESPONSE", "color: #0a8a00; font-weight: bold");
    console.log("← Status:", res.status);
    console.log("← Data:", res.data);

    const {
      token: newToken,
      username,
      email
    } = res.data;

    const userObj: User = {
      username,
      correo: email
    };

    localStorage.setItem(LS_TOKEN_KEY, newToken);
    localStorage.setItem(LS_USER_KEY, JSON.stringify(userObj));

    setToken(newToken);
    setUser(userObj);
  } catch (err) {
    // Debug: error crudo
    console.error("%c[AUTH] - LOGIN ERROR", "color: #b00020; font-weight: bold", err);
    throw err; // dejamos que el llamador (Login.tsx) lo maneje
  }
};

  const logout = (redirect = true) => doLogout(redirect);

  const tokenValid = () => !!token && !isTokenExpired(token);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && !isTokenExpired(token)),
      login,
      logout,
      tokenValid,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
