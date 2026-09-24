import type { BasePagination, BaseResponse } from "./common.model";

export interface CustomerResponse extends BaseResponse, BasePagination {
    data: Customer[];
}

export interface CustomerByIdResponse extends BaseResponse {
    data: Customer;
}

export interface Customer {
    id: string;
    warehouse_code?: string;
    code: string;
    name: string;
    email: string;
    address: string;
    status: string;
    phone: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

export interface CreateCustomerRequest {
    code: string;
    name: string;
    email: string;
    address: string;
    status: string;
    phone: string;
}

export interface UpdateCustomerRequest {
    name: string;
    address: string;
    status: string;
    email: string;
    phone: string;
}
