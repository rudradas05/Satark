import React, { createContext, useContext, useMemo, useState } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (_email: string, _password: string) => {
    // TODO: replace with API
    setIsAuthenticated(true);
  };

  const signup = async (_name: string, _email: string, _password: string) => {
    // TODO: replace with API
    setIsAuthenticated(true);
  };

  const logout = () => setIsAuthenticated(false);

  const value = useMemo(
    () => ({ isAuthenticated, login, signup, logout }),
    [isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
