/**
 * context/AuthContext.tsx
 *
 * Manages authenticated user state.
 * On login/register the JWT is stored in localStorage via tokenStore (api.ts).
 * On mount, if a token exists, /auth/me is called to rehydrate the user.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { api, tokenStore, ApiUser, ApiError } from '../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id:       number;
  username: string;
  email:    string;
  role:     'Admin' | 'Customer';
}

interface AuthContextType {
  user:            AuthUser | null;
  isAuthenticated: boolean;
  isLoading:       boolean;
  login:    (email: string, password: string)                   => Promise<{ success: boolean; message: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout:   () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toAuthUser(u: ApiUser): AuthUser {
  return { id: u.id, username: u.username, email: u.email, role: u.role };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,      setUser]      = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ── Rehydrate session on mount ──────────────────────────────────────────────
  useEffect(() => {
    const token = tokenStore.get();
    if (!token) {
      setIsLoading(false);
      return;
    }

    api.auth.getMe()
      .then(({ user: apiUser }) => setUser(toAuthUser(apiUser)))
      .catch(() => {
        tokenStore.remove();
      })
      .finally(() => setIsLoading(false));
  }, []);

  // ── Login ───────────────────────────────────────────────────────────────────
  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
      if (!email || !password) {
        return { success: false, message: 'Email and password are required.' };
      }
      try {
        const response = await api.auth.login({ email, password });
        tokenStore.set(response.token);
        setUser(toAuthUser(response.user));
        return { success: true, message: `Welcome back, ${response.user.username}!` };
      } catch (err) {
        if (err instanceof ApiError) return { success: false, message: err.message };
        return { success: false, message: 'Unable to connect. Please try again.' };
      }
    },
    [],
  );

  // ── Register ────────────────────────────────────────────────────────────────
  const register = useCallback(
    async (username: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
      if (!username || !email || !password) return { success: false, message: 'All fields are required.' };
      if (password.length < 8) return { success: false, message: 'Password must be at least 8 characters.' };
      try {
        const response = await api.auth.register({ username, email, password });
        tokenStore.set(response.token);
        setUser(toAuthUser(response.user));
        return { success: true, message: `Welcome to Fondo, ${response.user.username}!` };
      } catch (err) {
        if (err instanceof ApiError) return { success: false, message: err.message };
        return { success: false, message: 'Registration failed. Please try again.' };
      }
    },
    [],
  );

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    tokenStore.remove();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
