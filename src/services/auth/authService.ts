import { ApiResponse, useApi } from "@/hooks/useApi";
import { AUTH, USER } from "../api";
import { LoginResponse, RegisterResponse, User } from "./types";
import { tokenManager } from "@/utils/tokenManager";

export const AuthService = (onTokenRefreshed?: () => void) => {
  const api = useApi({
    onTokenRefreshed,
    tokenManager,
    onAuthError: () => {
      tokenManager.clearTokens();
    }
  });
  return {
    async login(
      username: string,
      password: string,
      rememberMe = false
    ): Promise<ApiResponse<LoginResponse>> {
      try {
        const params = new URLSearchParams();
        params.append("username", username);
        params.append("password", password);
        
        const response = await api.post(AUTH.LOGIN, params.toString(), {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        
        if (response?.data) {
          await tokenManager.setTokens(response.data, rememberMe);
        }
        
        return response;
      } catch (error: any) {
        tokenManager.clearTokens();
        
        // Format error for better handling in UI
        const formattedError = {
          code: error.code || 401,
          message: error.message || 'Authentication failed',
          data: null,
          errors: error.errors || { auth: 'Invalid username or password' }
        };
        
        throw formattedError;
      }
    },

    async register(
      username: string,
      password: string
    ): Promise<ApiResponse<RegisterResponse>> {
      try {
        const response = await api.post(AUTH.REGISTER, {
          username,
          password,
        });
        return response;
      } catch (error) {
        throw error;
      }
    },

    async logout(refresh_token: string): Promise<ApiResponse<string>> {
      try {
        const response = await api.post(AUTH.LOGOUT, { refresh_token });
        return response;
      } catch (error) {
        throw error;
      } finally {
        // Luôn xóa tokens khi logout, ngay cả khi API fail
        tokenManager.clearTokens();
      }
    },

    async refreshToken(): Promise<ApiResponse<LoginResponse>> {
      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await api.post(AUTH.REFRESH_TOKEN, { refresh_token: refreshToken });
        
        if (response?.data) {
          await tokenManager.setTokens(response.data);
        }
        return response;
      } catch (error) {
        tokenManager.clearTokens();
        throw error;
      }
    },

    async getCurrentUser(): Promise<ApiResponse<User>> {
      try {
        // Validate session trước khi gọi API
        const isValidSession = await tokenManager.validateSession();
        if (!isValidSession) {
          throw new Error('Invalid session');
        }
        
        const response = await api.get(USER.GET_CURRENT);
        return response;
      } catch (error) {
        // Nếu có lỗi session hoặc API, xóa tokens
        tokenManager.clearTokens();
        throw error;
      }
    },
  };
};
