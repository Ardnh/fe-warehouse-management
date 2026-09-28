import { useApi } from "~/composables";
import type { RequestOptions } from "~/constants";
import type {
    BaseResponse,
    CreateZoneRequest,
    UpdateZoneRequest,
    ZoneByIdResponse,
    ZoneListResponse,
} from "~/models";
export const useZoneRepository = () => {
    const { api } = useApi();
    return {
        findAll: (query: Record<string, unknown>, opts?: RequestOptions) =>
            api<ZoneListResponse>("/zone", { query, signal: opts?.signal }),
        findByWarehouseId: (
            query: Record<string, unknown>,
            warehouseId: string,
            opts?: RequestOptions,
        ) =>
            api<ZoneListResponse>(`/zone/warehouse/${warehouseId}`, {
                query,
                signal: opts?.signal,
            }),
        findById: (id: string, opts?: RequestOptions) =>
            api<ZoneByIdResponse>(`/zone/${id}`, { signal: opts?.signal }),
        create: (req: CreateZoneRequest, opts?: RequestOptions) =>
            api<BaseResponse>("/zone", {
                method: "POST",
                body: req,
                signal: opts?.signal,
            }),
        update: (id: string, req: UpdateZoneRequest, opts?: RequestOptions) =>
            api<BaseResponse>(`/zone/${id}`, {
                method: "PUT",
                body: req,
                signal: opts?.signal,
            }),
        delete: (id: string, opts?: RequestOptions) =>
            api<BaseResponse>(`/zone/${id}`, {
                method: "DELETE",
                signal: opts?.signal,
            }),
    };
};
