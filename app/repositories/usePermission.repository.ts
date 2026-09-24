import type {
    BaseResponse,
    PermissionsResponse,
    PermissionsResponseById,
    CreateUpdatePermissionRequest,
} from "~/models";
import type { RequestOptions } from "~/constants";

export const usePermissionsRepository = () => {
    const { $api } = useNuxtApp();
    return {
        findAll: (query: Record<string, any>, opts?: RequestOptions) =>
            $api<PermissionsResponse>("/permission", { query, ...opts }),
        findById: (id: string, opts?: RequestOptions) =>
            $api<PermissionsResponseById>(`/permission/${id}`, { ...opts }),
        create: (req: CreateUpdatePermissionRequest, opts?: RequestOptions) =>
            $api<BaseResponse>(`/permission`, {
                method: "POST",
                body: req,
                ...opts,
            }),
    };
};
