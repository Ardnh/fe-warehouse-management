import type { BasePagination, BaseResponse } from "./common.model";

export interface UomResponse extends BaseResponse, BasePagination {
    data: Uom[];
}

export interface UomByIdResponse extends BaseResponse {
    data: Uom;
}

export interface Uom {
    id: string;
    code: string;
    name: string;
    type: string;
    created_at: string;
    updated_at: string;
}

export interface CreateUomRequest {
    code: string;
    name: string;
    type: string;
}

export interface UpdateUomRequest {
    name?: string;
    type?: string;
}
