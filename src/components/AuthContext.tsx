import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from '@base44/sdk';
import { getBase44, isBase44Configured } from '../lib/base44';
import { getLocalAdminEnabled, setLocalAdminEnabled } from '../lib/convites';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isBase44Configured());
  const [localAdmin, setLocalAdmin] = useState(getLocalAdminEnabled());

  const refresh = async () => {
    if (!isBase44Configured()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      setUser(await getBase44().auth.me());
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAdmin: isBase44Configured() ? user?.role === 'admin' : localAdmin,
      isConfigured: isBase44Configured(),
      login: async (email, password) => {
        if (!isBase44Configured()) {
          setLocalAdminEnabled(true);
          setLocalAdmin(true);
          return;
        }
        const response = await getBase44().auth.loginViaEmailPassword(email, password);
        setUser(response.user);
      },
      loginWithGoogle: () => {
        if (isBase44Configured()) {
          getBase44().auth.loginWithProvider('google', '/admin');
        } else {
          setLocalAdminEnabled(true);
          setLocalAdmin(true);
        }
      },
      logout: () => {
        if (isBase44Configured()) {
          getBase44().auth.logout('/');
        } else {
          setLocalAdminEnabled(false);
          setLocalAdmin(false);
        }
      },
      refresh,
    }),
    [loading, localAdmin, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth precisa estar dentro de AuthProvider');
  return context;
}
