const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<User>;
  register: (email: string, name: string, pass: string, role?: string) => Promise<User>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ovia_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ovia_token'));
  const [loading, setLoading] = useState<boolean>(true);

  // useEffect(() => {
  //   const initAuth = async () => {
  //     const storedToken = localStorage.getItem('ovia_token');
  //     if (storedToken) {
  //       try {
  //         const profile = await authService.getMe();
  //         setUser(profile);
  //         localStorage.setItem('ovia_user', JSON.stringify(profile));
  //       } catch (err) {
  //         console.warn('Session expired or invalid, logging out.');
  //         localStorage.removeItem('ovia_token');
  //         localStorage.removeItem('ovia_user');
  //         setToken(null);
  //         setUser(null);
  //       }
  //     }
  //     setLoading(false);
  //   };
  //   initAuth();
  // }, []);


  useEffect(() => {
  const initAuth = async () => {
    const storedToken = localStorage.getItem('ovia_token');

    if (DEMO_MODE || !storedToken) {
      setLoading(false);
      return;
    }

    try {
      const profile = await authService.getMe();
      setUser(profile);
      localStorage.setItem('ovia_user', JSON.stringify(profile));
    } catch {
      localStorage.removeItem('ovia_token');
      localStorage.removeItem('ovia_user');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  void initAuth();
}, []);





  const login = async (email: string, pass: string): Promise<User> => {
    setLoading(true);
    try {
      const resp = await authService.login(email, pass);
      localStorage.setItem('ovia_token', resp.access_token);
      localStorage.setItem('ovia_user', JSON.stringify(resp.user));
      setToken(resp.access_token);
      setUser(resp.user);
      return resp.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, name: string, pass: string, role: string = 'student'): Promise<User> => {
    setLoading(true);
    try {
      const resp = await authService.register(email, name, pass, role);
      localStorage.setItem('ovia_token', resp.access_token);
      localStorage.setItem('ovia_user', JSON.stringify(resp.user));
      setToken(resp.access_token);
      setUser(resp.user);
      return resp.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ovia_token');
    localStorage.removeItem('ovia_user');
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const profile = await authService.getMe();
      setUser(profile);
      localStorage.setItem('ovia_user', JSON.stringify(profile));
    } catch (err) {
      logout();
    }
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        refreshProfile,
        hasRole,
      }}
    >
      {children}
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
