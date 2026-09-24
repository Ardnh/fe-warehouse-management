import { useApi } from "~/composables";
import type { RequestOptions } from "~/constants";
import type { BaseResponse, CustomerByIdResponse, CustomerResponse, CreateCustomerRequest, UpdateCustomerRequest } from "~/models";

export const useCustomerRepository = () => {
    const { api } = useApi();
    return {
        findAll: (query: Record<string, unknown>, opts?: RequestOptions) => api<CustomerResponse>("/customer", { query, signal: opts?.signal }),
        findById: (id: string, opts?: RequestOptions) => api<CustomerByIdResponse>(`/customer/${id}`, { signal: opts?.signal }),
        create: (req: CreateCustomerRequest, opts?: RequestOptions) => api<BaseResponse>("/customer", { method: "POST", body: req, signal: opts?.signal }),
        update: (id: string, req: UpdateCustomerRequest, opts?: RequestOptions) => api<BaseResponse>(`/customer/${id}`, { method: "PUT", body: req, signal: opts?.signal }),
        delete: (id: string, opts?: RequestOptions) => api<BaseResponse>(`/customer/${id}`, { method: "DELETE", signal: opts?.signal }),
    };
};
