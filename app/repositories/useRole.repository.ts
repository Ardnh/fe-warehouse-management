import type { RolesResponse, BaseResponse, RolesByIdResponse } from "../models";
import type { RequestOptions } from "~/constants";

export const useRoleRepository = () => {
    const { $api } = useNuxtApp();
    // const { api } = useApi();
    return {
        findAll: (query: Record<string, any>, opts?: RequestOptions) =>
            $api<RolesResponse>("/role", { query, signal: opts?.signal }),
        findById: (id: string, opts?: RequestOptions) =>
            $api<RolesByIdResponse>(`/role/${id}`, { signal: opts?.signal }),
        create: (req: any, opts?: RequestOptions) =>
            $api<BaseResponse>(`/role`, {
                method: "POST",
                body: req,
                signal: opts?.signal,
            }),
        update: (id: string, req: any, opts?: RequestOptions) =>
            $api<BaseResponse>(`/role/${id}`, {
                method: "PUT",
                body: req,
                signal: opts?.signal,
            }),
        delete: (id: string, opts?: RequestOptions) =>
            $api<BaseResponse>(`/role/${id}`, {
                method: "DELETE",
                signal: opts?.signal,
            }),
    };
};
