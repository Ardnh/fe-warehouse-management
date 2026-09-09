import type { Pagination } from "./pagination.model";

export interface BaseResponse {
    success: boolean;
    message: string;
}

export interface BasePagination {
    pagination: Pagination;
}

export interface BaseParams {
    page: number;
    page_size: number;
    search: string;
}

export interface Options {
    label: string;
    value: string;
}
