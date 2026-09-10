import { useApi } from "~/composables/useApi.composable";
import type { UserResponse, UserByIdResponse, BaseResponse } from "~/models";

export const useUserRepository = () => {
    const { api } = useApi();
    return {
        FindAll: (query: Record<string, any>) =>
            api<UserResponse>("/user", { query }),
        FindById: (id: string) => api<UserByIdResponse>(`/user/${id}`),
        Create: (req: any) =>
            api<BaseResponse>(`/user`, { method: "POST", body: req }),
        Update: (id: string, req: any) =>
            api<BaseResponse>(`/user/${id}`, { method: "PUT", body: req }),
        Delete: (id: string) =>
            api<BaseResponse>(`/user/${id}`, { method: "DELETE" }),
    };
};
