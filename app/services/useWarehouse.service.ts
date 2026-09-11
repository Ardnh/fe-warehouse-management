import type {
    BaseParams,
    CreateWarehouseRequest,
    UpdateWarehouseRequest,
} from "~/models";
import type { RequestOptions } from "~/constants";
import { cleanObject } from "~/utils";
import { useWarehouseRepository } from "~/repositories";

export const useWarehouseService = () => {
    const { FindAll, FindById, Create, Update, Delete } =
        useWarehouseRepository();

    const findAll = (params: BaseParams, opts?: RequestOptions) =>
        FindAll(cleanObject(params), opts);

    const findById = (id: string, opts?: RequestOptions) => FindById(id, opts);

    const create = (req: CreateWarehouseRequest, opts?: RequestOptions) =>
        Create(req, opts);

    const update = (
        id: string,
        req: UpdateWarehouseRequest,
        opts?: RequestOptions,
    ) => Update(id, req, opts);

    const deleteWarehouse = (id: string, opts?: RequestOptions) =>
        Delete(id, opts);

    return { findAll, findById, create, update, deleteWarehouse };
};
