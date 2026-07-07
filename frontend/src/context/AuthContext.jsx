import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = window.localStorage.getItem('nexcrm_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => window.localStorage.getItem('nexcrm_token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      authAPI
        .me()
        .then((response) => setUser(response.user))
        .catch(() => {
          setToken(null);
          setUser(null);
          window.localStorage.removeItem('nexcrm_token');
          window.localStorage.removeItem('nexcrm_user');
        });
    }
  }, [token, user]);

  const saveSession = (tokenValue, userValue) => {
    window.localStorage.setItem('nexcrm_token', tokenValue);
    window.localStorage.setItem('nexcrm_user', JSON.stringify(userValue));
    setToken(tokenValue);
    setUser(userValue);
  };

  const login = async (credentials) => {
    const payload = await authAPI.login(credentials);
    saveSession(payload.token, payload.user);
  };

  const register = async (credentials) => {
    const payload = await authAPI.register(credentials);
    saveSession(payload.token, payload.user);
  };

  const logout = () => {
    window.localStorage.removeItem('nexcrm_token');
    window.localStorage.removeItem('nexcrm_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updated) => {
    const nextUser = { ...user, ...updated };
    setUser(nextUser);
    window.localStorage.setItem('nexcrm_user', JSON.stringify(nextUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
