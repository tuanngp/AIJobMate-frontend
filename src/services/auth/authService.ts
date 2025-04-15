import { ApiResponse, useApi } from "@/hooks/useApi"
import { AUTH } from "../api";
import { LoginResponse, RegisterResponse } from "./types";

const api = useApi();
export const AuthService = {
    async login(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
        const response = await api.post(AUTH.LOGIN, {
            username,
            password
        });
        
        return response.data; 
    },

    async register(username: string, password: string): Promise<ApiResponse<RegisterResponse>> {
        const response = await api.post(AUTH.REGISTER, {
            username,
            password
        });
        return response.data;
    },

    async logout(): Promise<ApiResponse<string>> {
        const response = await api.post(AUTH.LOGOUT);
        return response.data;
    },

    async refreshToken(): Promise<ApiResponse<string>> {
        const response = await api.post(AUTH.REFRESH_TOKEN);
        return response.data;
    },
}