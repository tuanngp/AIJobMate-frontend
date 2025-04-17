import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/services/auth/types';
import { AuthService } from '@/services/auth/authService';
import Cookies from 'js-cookie';
import { EventEmitter } from 'events';

const authEvents = new EventEmitter();
const TOKEN_REFRESHED_EVENT = 'token_refreshed';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  notifyTokenRefreshed: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const notifyTokenRefreshed = () => {
    authEvents.emit(TOKEN_REFRESHED_EVENT);
  };
  
  const authService = AuthService(notifyTokenRefreshed);

  const validateAndUpdateUser = async () => {
    try {
      const accessToken = Cookies.get('access_token');
      if (accessToken) {
        const response = await authService.getCurrentUser();
        if (response) {
          console.log('User data:', response);
          setUser(response.data);
        }
      }
    } catch (error) {
      console.error('Error validating user:', error);
      // Nếu có lỗi khi lấy thông tin user, xóa token và đăng xuất
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Lắng nghe sự kiện token được refresh
  useEffect(() => {
    const handleTokenRefreshed = () => {
      validateAndUpdateUser();
    };

    authEvents.on(TOKEN_REFRESHED_EVENT, handleTokenRefreshed);

    return () => {
      authEvents.off(TOKEN_REFRESHED_EVENT, handleTokenRefreshed);
    };
  }, []);

  // Kiểm tra và lấy thông tin user khi component mount
  useEffect(() => {
    validateAndUpdateUser();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login(username, password);
      if (response) {
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

        // Lấy thông tin user sau khi đăng nhập thành công
        await validateAndUpdateUser();
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
      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        try {
          await authService.logout(refreshToken);
        } catch (error) {
          console.error('Logout error:', error);
        }
      }
    } finally {
      setUser(null);
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    notifyTokenRefreshed,
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