import type { RequestOptions } from "../constants";
import type {
    UserResponse,
    UserByIdResponse,
    BaseResponse,
    UserProfileResponse,
} from "~/models";

export const useUserRepository = () => {
    // const { api } = useApi();
    const { $api } = useNuxtApp();
    return {
        findAll: (query: Record<string, any>, opts?: RequestOptions) =>
            $api<UserResponse>("/user", { query, signal: opts?.signal }),
        findById: (id: string, opts?: RequestOptions) =>
            $api<UserByIdResponse>(`/user/${id}`, { signal: opts?.signal }),
        findProfile: (opts?: RequestOptions) =>
            $api<UserProfileResponse>(`/user/profile`, {
                signal: opts?.signal,
            }),
        create: (req: any, opts?: RequestOptions) =>
            $api<BaseResponse>(`/user`, {
                method: "POST",
                body: req,
                signal: opts?.signal,
            }),
        update: (id: string, req: any, opts?: RequestOptions) =>
            $api<BaseResponse>(`/user/${id}`, {
                method: "PUT",
                body: req,
                signal: opts?.signal,
            }),
        delete: (id: string, opts?: RequestOptions) =>
            $api<BaseResponse>(`/user/${id}`, {
                method: "DELETE",
                signal: opts?.signal,
            }),
    };
};
