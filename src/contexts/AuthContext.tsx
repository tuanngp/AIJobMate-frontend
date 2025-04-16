import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/services/auth/types';
import { AuthService } from '@/services/auth/authService';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authService = AuthService();

  useEffect(() => {
    // Kiểm tra token trong localStorage khi component mount
    const accessToken = Cookies.get('access_token');
    if (accessToken) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login(username, password);
      if (response) {
        setUser(response.meta?.user);
        Cookies.set('access_token', response.data.access_token, {
          secure: true,
          sameSite: 'strict'
        });

        if (response.data.refresh_token) {
          Cookies.set('refresh_token', response.data.refresh_token, {
            secure: true,
            sameSite: 'strict'
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (username: string, password: string) => {
    try {
      await authService.register(username, password);
      await login(username, password);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout(Cookies.get('refresh_token') || '');
      setUser(null);
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}