import type { PermissionsResponse, PermissionsResponseById } from "~/models";
import type { BaseResponse } from "~/models/common.model";

export const usePermissionsRepository = () => {
    const { api } = useApi();
    return {
        FindAll: (query: Record<string, any>) =>
            api<PermissionsResponse>("/permissions", { query }),
        FindById: (id: string) =>
            api<PermissionsResponseById>(`/permissions/${id}`),
        Create: (req: any) =>
            api<BaseResponse>(`/permissions`, { method: "POST", body: req }),
    };
};
