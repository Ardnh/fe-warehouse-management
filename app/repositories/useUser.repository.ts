import type { RequestOptions } from "../constants";
import type { UserResponse, UserByIdResponse, BaseResponse } from "~/models";

export const useUserRepository = () => {
    // const { api } = useApi();
    const { $api } = useNuxtApp();
    return {
        FindAll: (query: Record<string, any>, opts?: RequestOptions) =>
            $api<UserResponse>("/user", { query, signal: opts?.signal }),
        FindById: (id: string, opts?: RequestOptions) =>
            $api<UserByIdResponse>(`/user/${id}`, { signal: opts?.signal }),
        Create: (req: any, opts?: RequestOptions) =>
            $api<BaseResponse>(`/user`, {
                method: "POST",
                body: req,
                signal: opts?.signal,
            }),
        Update: (id: string, req: any, opts?: RequestOptions) =>
            $api<BaseResponse>(`/user/${id}`, {
                method: "PUT",
                body: req,
                signal: opts?.signal,
            }),
        Delete: (id: string, opts?: RequestOptions) =>
            $api<BaseResponse>(`/user/${id}`, {
                method: "DELETE",
                signal: opts?.signal,
            }),
    };
};
