import { useApi } from "@/hooks/useApi";
import { USER } from "../api";

const api = useApi();

export const UserService = {
    async getCurrentUser(): Promise<any> {
        return await api.get(USER.GET_CURRENT);
    },

    async updateCurrentUser(data: any): Promise<any> {
        return await api.put(USER.UPDATE_CURRENT, data);
    },

    async getUser(id: number): Promise<any> {
        return await api.get(USER.GET(id));
    },

    async updateUser(id: number, data: any): Promise<any> {
        return await api.put(USER.UPDATE(id), data);
    },

    async deleteUser(id: number): Promise<any> {
        return await api.delete(USER.DELETE(id));
    },

    async getUsers(): Promise<any> {
        return await api.get(USER.GET_LIST);
    },

    async disableUser(id: number): Promise<any> {
        return await api.post(USER.DISABLE(id));
    },

    async enableUser(id: number): Promise<any> {
        return await api.post(USER.ENABLE(id));
    },
}