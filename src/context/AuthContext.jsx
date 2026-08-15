import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axiosInstance from '../services/axiosInstance';
import { getMe } from '../services/api/auth';

const TOKEN_KEY = 'greenshield_token';
const ADMIN_KEY = 'greenshield_admin';

export const AuthContext = createContext(undefined);

const readStoredSession = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const admin = localStorage.getItem(ADMIN_KEY);
    return { token, admin: admin ? JSON.parse(admin) : null };
  } catch {
    return { token: localStorage.getItem(TOKEN_KEY), admin: null };
  }
};

export const AuthProvider = ({ children }) => {
  const stored = useMemo(readStoredSession, []);
  const [admin, setAdmin] = useState(stored.admin);
  const [token, setToken] = useState(stored.token);
  const [isLoading, setIsLoading] = useState(!!stored.token);

  useEffect(() => {
    const onUnauthorized = () => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ADMIN_KEY);
      delete axiosInstance.defaults.headers.common['Authorization'];
      setToken(null);
      setAdmin(null);
      setIsLoading(false);
    };
    window.addEventListener('greenshield:unauthorized', onUnauthorized);
    return () => window.removeEventListener('greenshield:unauthorized', onUnauthorized);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const userData = await getMe();
        setAdmin(userData);
        try {
          localStorage.setItem(ADMIN_KEY, JSON.stringify(userData));
        } catch {
          // ignore storage errors
        }
      } catch {
        // Session stays cached locally. A hard 401 is handled by the global
        // response interceptor in axiosInstance (clears storage + state).
      }
      setIsLoading(false);
    };
    initAuth();
  }, [token]);

  const login = (newToken, newAdmin) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    try {
      localStorage.setItem(ADMIN_KEY, JSON.stringify(newAdmin));
    } catch {
      // ignore storage errors
    }
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setAdmin(newAdmin);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
    delete axiosInstance.defaults.headers.common['Authorization'];
    setToken(null);
    setAdmin(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ admin, token, isAuthenticated: !!token, isLoading, login, logout, setAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};