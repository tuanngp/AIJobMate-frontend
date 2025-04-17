import { ApiResponse, useApi } from "@/hooks/useApi";
import { USER } from "../api";
import { User } from "../auth/types";


export const UserService = () => {
    const api = useApi();
    return {
        async getCurrentUser(): Promise<ApiResponse<User>> {
            const response = await api.get(USER.GET_CURRENT);
            return response;
        },
    
        async updateCurrentUser(data: User): Promise<ApiResponse<User>> {
            const response = await api.put(USER.UPDATE_CURRENT, data);
            return response;
        },
    
        async getUser(id: number): Promise<ApiResponse<User>> {
            const response = await api.get(USER.GET(id));
            return response;
        },
    
        async updateUser(id: number, data: User): Promise<ApiResponse<User>> {
            const response = await api.put(USER.UPDATE(id), data);
            return response;
        },
    
        async deleteUser(id: number): Promise<ApiResponse<User>> {
            const response = await api.delete(USER.DELETE(id));
            return response;
        },
    
        async getUsers(): Promise<ApiResponse<User[]>> {
            const response = await api.get(USER.GET_LIST);
            return response;
        },
    
        async disableUser(id: number): Promise<ApiResponse<any>> {
            const response = await api.post(USER.DISABLE(id));
            return response;
        },
    
        async enableUser(id: number): Promise<ApiResponse<any>> {
            const response = await api.post(USER.ENABLE(id));
            return response;
        },
    }
}