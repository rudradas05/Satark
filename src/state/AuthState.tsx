import React, { createContext, useContext, useMemo, useState } from 'react';
import { Platform } from 'react-native';

type AuthUser = {
  id: string;
  userName: string;
  email?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
};

type AuthPayload = {
  token: string;
  user: AuthUser;
};

type LoginInput = {
  identifier: string;
  password: string;
};

type SignupInput = {
  userName: string;
  email?: string;
  phone?: string;
  password: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
  login: (input: LoginInput) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => void;
};

const API_BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:4000'
    : 'http://localhost:4000';

const AuthContext = createContext<AuthContextType | null>(null);

function normalizeIdentifier(identifier: string) {
  const trimmed = identifier.trim();
  const digits = trimmed.replace(/\D/g, '');
  const isPhone = digits.length >= 10 && !trimmed.includes('@');

  if (isPhone) {
    return { phone: digits };
  }

  return { email: trimmed.toLowerCase() };
}

function hasErrorMessage(data: unknown): data is { error: string } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    typeof data.error === 'string'
  );
}

function isAuthPayload(data: unknown): data is AuthPayload {
  if (typeof data !== 'object' || data === null) return false;
  if (!('token' in data) || !('user' in data)) return false;

  const token = data.token;
  const user = data.user;

  return (
    typeof token === 'string' &&
    typeof user === 'object' &&
    user !== null &&
    'id' in user &&
    'userName' in user &&
    typeof user.id === 'string' &&
    typeof user.userName === 'string'
  );
}

async function requestAuth<TBody extends object>(
  path: '/auth/login' | '/auth/signup',
  body: TBody,
) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message = hasErrorMessage(data) ? data.error : 'Request failed';
    throw new Error(message);
  }

  if (!isAuthPayload(data)) {
    throw new Error('Invalid auth response');
  }

  return data;
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async ({ identifier, password }: LoginInput) => {
    const payload = await requestAuth('/auth/login', {
      ...normalizeIdentifier(identifier),
      password,
    });

    setToken(payload.token);
    setUser(payload.user);
  };

  const signup = async ({ userName, email, phone, password }: SignupInput) => {
    const payload = await requestAuth('/auth/signup', {
      userName: userName.trim().toLowerCase(),
      email: email?.trim() ? email.trim().toLowerCase() : undefined,
      phone: phone?.trim() ? phone.trim() : undefined,
      password,
    });

    setToken(payload.token);
    setUser(payload.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token && user),
      token,
      user,
      login,
      signup,
      logout,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
