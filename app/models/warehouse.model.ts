import type { BasePagination, BaseResponse } from "./common.model";
import type { Location } from "./location.model";

export interface WarehouseResponse extends BaseResponse, BasePagination {
    data: Warehouse[];
}

export interface WarehouseByIdResponse extends BaseResponse {
    data: Warehouse;
}

export interface WarehouseZone {
    id: string;
    code?: string;
    name?: string;
}

export interface Warehouse {
    id: string;
    location_id: string;
    status: string;
    created_at: string;
    updated_at: string;
    location?: Location;
    zones?: WarehouseZone[];
}

export interface CreateWarehouseRequest {
    location_id: string;
    status?: string;
}

export interface UpdateWarehouseRequest {
    location_id?: string;
    status?: string;
}
