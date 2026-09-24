import type { RequestOptions } from "~/constants";
import type { BaseParams, CreateCustomerRequest, UpdateCustomerRequest } from "~/models";
import { useCustomerRepository } from "~/repositories";
import { cleanObject } from "~/utils";

export const useCustomerService = () => {
    const { findAll, findById, create, update, delete: deleteRequest } = useCustomerRepository();
    return {
        findAll: (params: BaseParams, opts?: RequestOptions) => findAll(cleanObject(params), opts),
        findById: (id: string, opts?: RequestOptions) => findById(id, opts),
        create: (req: CreateCustomerRequest, opts?: RequestOptions) => create(req, opts),
        update: (id: string, req: UpdateCustomerRequest, opts?: RequestOptions) => update(id, req, opts),
        deleteCustomer: (id: string, opts?: RequestOptions) => deleteRequest(id, opts),
    };
};
