import { useApi } from "~/composables";
import type { RequestOptions } from "~/constants";
import type {
    BaseResponse,
    WarehouseByIdResponse,
    WarehouseResponse,
} from "~/models";
import type { CreateWarehouseRequest, UpdateWarehouseRequest } from "~/models";

export const useWarehouseRepository = () => {
    const { api } = useApi();

    return {
        findAll: (query: Record<string, unknown>, opts?: RequestOptions) =>
            api<WarehouseResponse>("/warehouse", {
                query,
                signal: opts?.signal,
            }),
        findById: (id: string, opts?: RequestOptions) =>
            api<WarehouseByIdResponse>(`/warehouse/${id}`, {
                signal: opts?.signal,
            }),
        create: (req: CreateWarehouseRequest, opts?: RequestOptions) =>
            api<BaseResponse>("/warehouse", {
                method: "POST",
                body: req,
                signal: opts?.signal,
            }),
        update: (
            id: string,
            req: UpdateWarehouseRequest,
            opts?: RequestOptions,
        ) =>
            api<BaseResponse>(`/warehouse/${id}`, {
                method: "PUT",
                body: req,
                signal: opts?.signal,
            }),
        delete: (id: string, opts?: RequestOptions) =>
            api<BaseResponse>(`/warehouse/${id}`, {
                method: "DELETE",
                signal: opts?.signal,
            }),
    };
};
