import type { PermissionsResponse, PermissionsResponseById } from "~/models";
import type { BaseResponse } from "~/models/common.model";

export const usePermissionsRepository = () => {
    const { api } = useApi();
    return {
        FindAll: (query: Record<string, any>) =>
            api<PermissionsResponse>("/permission", { query }),
        FindById: (id: string) =>
            api<PermissionsResponseById>(`/permission/${id}`),
        Create: (req: any) =>
            api<BaseResponse>(`/permission`, { method: "POST", body: req }),
    };
};
