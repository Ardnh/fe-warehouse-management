import type {
    BaseParams,
    CreateWarehouseRequest,
    UpdateWarehouseRequest,
} from "~/models";
import type { RequestOptions } from "~/constants";
import { cleanObject } from "~/utils";
import { useWarehouseRepository } from "~/repositories";

export const useWarehouseService = () => {
    const {
        findAll: findAllRequest,
        findById: findByIdRequest,
        create: createRequest,
        update: updateRequest,
        delete: deleteRequest,
    } = useWarehouseRepository();

    const findAll = (params: BaseParams, opts?: RequestOptions) =>
        findAllRequest(cleanObject(params), opts);

    const findById = (id: string, opts?: RequestOptions) =>
        findByIdRequest(id, opts);

    const create = (req: CreateWarehouseRequest, opts?: RequestOptions) =>
        createRequest(req, opts);

    const update = (
        id: string,
        req: UpdateWarehouseRequest,
        opts?: RequestOptions,
    ) => updateRequest(id, req, opts);

    const deleteWarehouse = (id: string, opts?: RequestOptions) =>
        deleteRequest(id, opts);

    return { findAll, findById, create, update, deleteWarehouse };
};
