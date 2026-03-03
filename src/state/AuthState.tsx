import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform } from 'react-native';

import {
  readSessionItem,
  removeSessionItem,
  writeSessionItem,
} from '../utils/sessionStorage';

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

type ChangePasswordInput = {
  oldPassword: string;
  newPassword: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  isHydrating: boolean;
  token: string | null;
  user: AuthUser | null;
  login: (input: LoginInput) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => void;
  changePassword: (input: ChangePasswordInput) => Promise<void>;
};

const API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';

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

const AUTH_SESSION_KEY = 'auth_session';

async function readPersistedSession(): Promise<AuthPayload | null> {
  try {
    const raw = await readSessionItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isAuthPayload(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function persistSession(payload: AuthPayload): Promise<void> {
  await writeSessionItem(AUTH_SESSION_KEY, JSON.stringify(payload));
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    let cancelled = false;
    readPersistedSession().then(session => {
      if (cancelled) return;
      if (session) {
        setToken(session.token);
        setUser(session.user);
      }
      setIsHydrating(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async ({ identifier, password }: LoginInput) => {
    const payload = await requestAuth('/auth/login', {
      ...normalizeIdentifier(identifier),
      password,
    });

    setToken(payload.token);
    setUser(payload.user);
    await persistSession(payload);
  }, []);

  const signup = useCallback(
    async ({ userName, email, phone, password }: SignupInput) => {
      const payload = await requestAuth('/auth/signup', {
        userName: userName.trim().toLowerCase(),
        email: email?.trim() ? email.trim().toLowerCase() : undefined,
        phone: phone?.trim() ? phone.trim() : undefined,
        password,
      });

      setToken(payload.token);
      setUser(payload.user);
      await persistSession(payload);
    },
    [],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    removeSessionItem(AUTH_SESSION_KEY);
  }, []);

  const changePassword = useCallback(
    async ({ oldPassword, newPassword }: ChangePasswordInput) => {
      if (!token) {
        throw new Error('Not authenticated');
      }
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const message = hasErrorMessage(data)
          ? data.error
          : 'Failed to change password';
        throw new Error(message);
      }
    },
    [token],
  );

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token && user),
      isHydrating,
      token,
      user,
      login,
      signup,
      logout,
      changePassword,
    }),
    [token, user, isHydrating, login, signup, logout, changePassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
