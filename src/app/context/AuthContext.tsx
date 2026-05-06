import React, { createContext, useContext, useState, useCallback } from 'react';
import { users } from '../data/mockData';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Customer';
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'artisan_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    if (!email || !password) return { success: false, message: 'Email and password are required.' };

    // Simulate a brief network delay
    await new Promise(r => setTimeout(r, 400));

    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!found) return { success: false, message: 'No account found with that email address.' };
    if (found.status === 'Inactive') return { success: false, message: 'Your account is inactive. Please contact support.' };

    // Demo mode: any non-empty password works (hint shown in UI)
    const authUser: AuthUser = { id: found.id, name: found.name, email: found.email, role: found.role };
    setUser(authUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    return { success: true, message: `Welcome back, ${found.name.split(' ')[0]}!` };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    if (!name || !email || !password) return { success: false, message: 'All fields are required.' };
    if (password.length < 8) return { success: false, message: 'Password must be at least 8 characters.' };

    await new Promise(r => setTimeout(r, 400));

    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (exists) return { success: false, message: 'An account with that email already exists.' };

    const newUser: AuthUser = { id: `user-${Date.now()}`, name: name.trim(), email: email.trim().toLowerCase(), role: 'Customer' };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return { success: true, message: `Welcome to Artisan Bean Hub, ${name.split(' ')[0]}!` };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
