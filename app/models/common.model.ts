import type { Pagination } from "./pagination.model";

export interface BaseResponse {
    success: boolean;
    message: string;
}

export interface BasePagination {
    pagination: Pagination;
}

export interface Params {
    page: number;
    page_size: number;
}

export interface Options {
    label: string;
    value: string;
}
