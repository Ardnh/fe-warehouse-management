import type { RolesResponse, BaseResponse, RolesByIdResponse } from "../models";
import type { RequestOptions } from "~/constants";

export const useRoleRepository = () => {
    const { $api } = useNuxtApp();
    // const { api } = useApi();
    return {
        FindAll: (query: Record<string, any>, opts?: RequestOptions) =>
            $api<RolesResponse>("/role", { query, signal: opts?.signal }),
        FindById: (id: string, opts?: RequestOptions) =>
            $api<RolesByIdResponse>(`/role/${id}`, { signal: opts?.signal }),
        Create: (req: any, opts?: RequestOptions) =>
            $api<BaseResponse>(`/role`, {
                method: "POST",
                body: req,
                signal: opts?.signal,
            }),
        Update: (id: string, req: any, opts?: RequestOptions) =>
            $api<BaseResponse>(`/role/${id}`, {
                method: "PUT",
                body: req,
                signal: opts?.signal,
            }),
        Delete: (id: string, opts?: RequestOptions) =>
            $api<BaseResponse>(`/role/${id}`, {
                method: "DELETE",
                signal: opts?.signal,
            }),
    };
};
