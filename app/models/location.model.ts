import type { BasePagination, BaseResponse } from "./common.model";

export type LocationType = "HO" | "WAREHOUSE";

export interface LocationResponse extends BaseResponse, BasePagination {
    data: Location[];
}

export interface LocationByIdResponse extends BaseResponse {
    data: Location;
}

export interface Location {
    id: string;
    code: string;
    name: string;
    type: LocationType;
    address?: string | null;
    city?: string | null;
    province?: string | null;
    postal_code?: string | null;
    is_active: boolean;
}

export interface CreateLocationRequest {
    code: string;
    name: string;
    type: LocationType;
    address?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    is_active?: boolean;
}

export interface UpdateLocationRequest {
    name?: string;
    type?: LocationType;
    address?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    is_active?: boolean;
}
