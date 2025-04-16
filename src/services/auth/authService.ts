import { ApiResponse, useApi } from "@/hooks/useApi";
import { AUTH } from "../api";
import { LoginResponse, RegisterResponse } from "./types";

export const AuthService = () => {
  const api = useApi();
  return {
    async login(
      username: string,
      password: string
    ): Promise<ApiResponse<LoginResponse>> {
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);
      const response = await api.post(AUTH.LOGIN, params.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      return response;
    },

    async register(
      username: string,
      password: string
    ): Promise<ApiResponse<RegisterResponse>> {
      const response = await api.post(AUTH.REGISTER, {
        username,
        password,
      });
      return response.data;
    },

    async logout(refresh_token: string): Promise<ApiResponse<string>> {
      const response = await api.post(AUTH.LOGOUT, { refresh_token });
      return response.data;
    },

    async refreshToken(): Promise<ApiResponse<string>> {
      const response = await api.post(AUTH.REFRESH_TOKEN);
      return response.data;
    },
  };
};
