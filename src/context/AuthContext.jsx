import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const session = authService.getSession();
      if (session) {
        const refreshed = await authService.refreshSession();
        if (refreshed.success) setUser(refreshed.user);
        else setUser(session);
      }
      setLoading(false);
    }
    load();
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) setUser(result.user);
    return result;
  }, []);

  const register = useCallback(async (userData) => {
    const result = await authService.register(userData);
    if (result.success) setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(() => {
    const session = authService.getSession();
    setUser(session);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
