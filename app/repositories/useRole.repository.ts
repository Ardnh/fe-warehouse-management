import type { RolesResponse, BaseResponse, RolesByIdResponse } from "../models";
import { useApi } from "../composables";

export const useRoleRepository = () => {
    const { api } = useApi();
    return {
        FindAll: (query: Record<string, any>) =>
            api<RolesResponse>("/role", { query }),
        FindById: (id: string) => api<RolesByIdResponse>(`/role/${id}`),
        Create: (req: any) =>
            api<BaseResponse>(`/role`, { method: "POST", body: req }),
        Update: (id: string, req: any) =>
            api<BaseResponse>(`/role/${id}`, { method: "PUT", body: req }),
        Delete: (id: string) =>
            api<BaseResponse>(`/role/${id}`, { method: "DELETE" }),
    };
};
