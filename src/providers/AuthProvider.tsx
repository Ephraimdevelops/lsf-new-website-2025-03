import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/axios';

type User = {
  id: string;
  email: string;
  role: string;
  created_at?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  setToken: (token?: string | null) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  setToken: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async (token?: string) => {
    // If token is provided, call /auth/me with Authorization header
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const res = await api.get('/auth/me', { headers });
      setUser(res.data.user);
      // persist minimal info locally for legacy code paths
      localStorage.setItem('auth-token', token || '');
      localStorage.setItem('user-role', res.data.user.role || 'user');
      localStorage.setItem('user-email', res.data.user.email || '');
    } catch (err) {
      console.error('Auth fetch error:', err);
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-role');
      localStorage.removeItem('user-email');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // On mount try to fetch user using cookie (no token)
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setToken = async (token?: string | null) => {
    if (token === null) {
      // explicit clear
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user-role');
      localStorage.removeItem('user-email');
      setUser(null);
      return;
    }
    // undefined -> fetch using cookie; string -> fetch using provided token
    await fetchUser(token || undefined);
  };

  const logout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-role');
    localStorage.removeItem('user-email');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
