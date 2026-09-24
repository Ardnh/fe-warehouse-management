import type { BasePagination, BaseResponse } from "./common.model";
import type { Customer } from "./customer.model";
import type { Uom } from "./uom.model";

export interface ProductResponse extends BaseResponse, BasePagination {
    data: Product[];
}

export interface ProductByIdResponse extends BaseResponse {
    data: Product;
}

export interface Product {
    id: string;
    customer_id: string;
    sku: string;
    name: string;
    uom_id: string;
    barcode?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    customer?: Customer;
    uom?: Uom;
}

export interface CreateProductRequest {
    customer_id: string;
    sku: string;
    name: string;
    uom_id: string;
    barcode?: string;
    status?: string;
}

export interface UpdateProductRequest {
    name?: string;
    barcode?: string;
    status?: string;
}
