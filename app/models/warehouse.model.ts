import type { BasePagination, BaseResponse } from "./common.model";

export interface WarehouseResponse extends BaseResponse, BasePagination {
    data: Warehouse[];
}

export interface WarehouseByIdResponse extends BaseResponse {
    data: Warehouse;
}

export interface Warehouse {
    id: string;
    code: string;
    name: string;
    address: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface CreateWarehouseRequest {
    code: string;
    name: string;
    address: string;
    status: string;
}
export interface UpdateWarehouseRequest {
    code?: string;
    name?: string;
    address?: string;
    status?: string;
}
