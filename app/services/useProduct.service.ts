import type { RequestOptions } from "~/constants";
import type { BaseParams, CreateProductRequest, UpdateProductRequest } from "~/models";
import { useProductRepository } from "~/repositories";
import { cleanObject } from "~/utils";

export const useProductService = () => {
    const { findAll, findById, create, update, delete: deleteRequest } = useProductRepository();
    return {
        findAll: (params: BaseParams, opts?: RequestOptions) => findAll(cleanObject(params), opts),
        findById: (id: string, opts?: RequestOptions) => findById(id, opts),
        create: (req: CreateProductRequest, opts?: RequestOptions) => create(req, opts),
        update: (id: string, req: UpdateProductRequest, opts?: RequestOptions) => update(id, req, opts),
        deleteProduct: (id: string, opts?: RequestOptions) => deleteRequest(id, opts),
    };
};
