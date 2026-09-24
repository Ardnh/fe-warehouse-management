import { useApi } from "~/composables";
import type { RequestOptions } from "~/constants";
import type {
    BaseResponse,
    CreateLocationRequest,
    LocationByIdResponse,
    LocationResponse,
    UpdateLocationRequest,
} from "~/models";

export const useLocationRepository = () => {
    const { api } = useApi();

    return {
        findAll: (query: Record<string, unknown>, opts?: RequestOptions) =>
            api<LocationResponse>("/location", { query, signal: opts?.signal }),
        findById: (id: string, opts?: RequestOptions) =>
            api<LocationByIdResponse>(`/location/${id}`, { signal: opts?.signal }),
        create: (req: CreateLocationRequest, opts?: RequestOptions) =>
            api<BaseResponse>("/location", {
                method: "POST",
                body: req,
                signal: opts?.signal,
            }),
        update: (id: string, req: UpdateLocationRequest, opts?: RequestOptions) =>
            api<BaseResponse>(`/location/${id}`, {
                method: "PUT",
                body: req,
                signal: opts?.signal,
            }),
        delete: (id: string, opts?: RequestOptions) =>
            api<BaseResponse>(`/location/${id}`, {
                method: "DELETE",
                signal: opts?.signal,
            }),
    };
};
