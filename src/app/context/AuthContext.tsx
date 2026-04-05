import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authService } from '../services/auth.service';
import { useNavigate } from 'react-router';

interface AuthContextType {
  user: User | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const PROACTIVE_REFRESH_WINDOW_MS = 2 * 60 * 1000;

let proactiveRefreshInFlight = false;

function readJwtExpiryMs(token: string): number | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = JSON.parse(atob(parts[1]));
    if (typeof payload?.exp !== "number") return null;
    return payload.exp * 1000;
  } catch {
    return null;
  }
}

function persistLoginSession(token: string, refreshToken?: string | null) {
  localStorage.setItem("token", token);
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  const now = Date.now();
  localStorage.setItem("tokenIssuedAt", String(now));
  const expiresAt = readJwtExpiryMs(token);
  if (expiresAt) {
    localStorage.setItem("tokenExpiresAt", String(expiresAt));
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(async () => {
      if (proactiveRefreshInFlight) return;

      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");
      const expiresAtRaw = localStorage.getItem("tokenExpiresAt");
      const expiresAt = Number(expiresAtRaw || 0);

      if (!token || !refreshToken || !expiresAt || Number.isNaN(expiresAt)) return;

      const remainMs = expiresAt - Date.now();
      if (remainMs > PROACTIVE_REFRESH_WINDOW_MS || remainMs <= 0) return;

      proactiveRefreshInFlight = true;
      try {
        const refreshed = await authService.refreshToken(token, refreshToken);
        if (refreshed?.token) {
          persistLoginSession(refreshed.token, refreshed.refreshToken);
          if (refreshed.user) {
            localStorage.setItem("user", JSON.stringify(refreshed.user));
            setUser(refreshed.user);
          }
        }
      } catch {
        // Interceptor fallback still handles forced re-login when refresh is invalid.
      } finally {
        proactiveRefreshInFlight = false;
      }
    }, 30 * 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const login = async (credentials: any) => {
    try {
      const data = await authService.login(credentials);
      persistLoginSession(data.token, data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/admin");
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
