import { useApi } from "~/composables";
import type { RequestOptions } from "~/constants";
import type { BaseResponse, CreateProductRequest, ProductByIdResponse, ProductResponse, UpdateProductRequest } from "~/models";

export const useProductRepository = () => {
    const { api } = useApi();
    return {
        findAll: (query: Record<string, unknown>, opts?: RequestOptions) => api<ProductResponse>("/product", { query, signal: opts?.signal }),
        findById: (id: string, opts?: RequestOptions) => api<ProductByIdResponse>(`/product/${id}`, { signal: opts?.signal }),
        create: (req: CreateProductRequest, opts?: RequestOptions) => api<BaseResponse>("/product", { method: "POST", body: req, signal: opts?.signal }),
        update: (id: string, req: UpdateProductRequest, opts?: RequestOptions) => api<BaseResponse>(`/product/${id}`, { method: "PUT", body: req, signal: opts?.signal }),
        delete: (id: string, opts?: RequestOptions) => api<BaseResponse>(`/product/${id}`, { method: "DELETE", signal: opts?.signal }),
    };
};
