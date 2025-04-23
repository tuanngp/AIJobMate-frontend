import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/services/auth/types';
import { AuthService } from '@/services/auth/authService';
import { EventEmitter } from 'events';
import { tokenManager } from '@/utils/tokenManager';
import { cacheUser, getCachedUser, clearUserCache } from '@/utils/cache';
import { isTokenExpired } from '@/utils/jwt';

const authEvents = new EventEmitter();
const TOKEN_REFRESHED_EVENT = 'token_refreshed';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string, rememberMe?: boolean) => Promise<void>;
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
      setLoading(true);

      // Check tokens exist
      const accessToken = tokenManager.getAccessToken();
      if (!accessToken) {
        await logout();
        return;
      }

      // Kiểm tra session validity
      const isValidSession = await tokenManager.validateSession();
      if (!isValidSession) {
        await logout();
        return;
      }

      // Kiểm tra token expiration
      if (isTokenExpired(accessToken)) {
        if (await tokenManager.shouldRefreshToken()) {
          try {
            await authService.refreshToken();
            notifyTokenRefreshed();
          } catch (refreshError) {
            await logout();
            return;
          }
        } else {
          await logout();
          return;
        }
      }

      // Kiểm tra cache trước
      const cachedUser = getCachedUser();
      if (cachedUser) {
        setUser(cachedUser);
        return;
      }

      // Nếu không có cache, gọi API
      try {
        const response = await authService.getCurrentUser();
        if (response?.data) {
          setUser(response.data);
          cacheUser(response.data);
        } else {
          await logout();
        }
      } catch (apiError) {
        await logout();
      }
    } catch (error) {
      await logout();
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

  const login = async (username: string, password: string, rememberMe = false) => {
    try {
      // Khởi tạo TokenManager nếu chưa
      await tokenManager.initialize();
      
      const response = await authService.login(username, password, rememberMe);
      
      if (response?.data) {
        await tokenManager.setTokens(response.data, rememberMe);
        
        if (response.meta?.user) {
          setUser(response.meta.user);
          cacheUser(response.meta.user);
        } else {
          await validateAndUpdateUser();
        }
      } else {
        throw new Error('Login failed - no response data');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (username: string, password: string) => {
    try {
      await authService.register(username, password);
      await login(username, password);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        try {
          await authService.logout(refreshToken);
        } catch (error) {
          // Silent error on logout API call
        }
      }
    } finally {
      setUser(null);
      tokenManager.clearTokens();
      clearUserCache();
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