import type {
    BaseResponse,
    PermissionsResponse,
    PermissionsResponseById,
} from "~/models";
import type { RequestOptions } from "~/constants";

export const usePermissionsRepository = () => {
    // const { api } = useApi();
    const { $api } = useNuxtApp();
    return {
        FindAll: (query: Record<string, any>, opts?: RequestOptions) =>
            $api<PermissionsResponse>("/permission", { query }),
        FindById: (id: string, opts?: RequestOptions) =>
            $api<PermissionsResponseById>(`/permission/${id}`),
        Create: (req: any, opts?: RequestOptions) =>
            $api<BaseResponse>(`/permission`, { method: "POST", body: req }),
    };
};
