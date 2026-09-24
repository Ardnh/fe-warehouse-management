import type { RequestOptions } from "~/constants";
import type { BaseParams, CreateUomRequest, UpdateUomRequest } from "~/models";
import { useUomRepository } from "~/repositories";
import { cleanObject } from "~/utils";

export const useUomService = () => {
    const {
        findAll: findAllRequest,
        findById: findByIdRequest,
        create: createRequest,
        update: updateRequest,
        delete: deleteRequest,
    } = useUomRepository();

    const findAll = (params: BaseParams, opts?: RequestOptions) =>
        findAllRequest(cleanObject(params), opts);

    const findById = (id: string, opts?: RequestOptions) =>
        findByIdRequest(id, opts);

    const create = (req: CreateUomRequest, opts?: RequestOptions) =>
        createRequest(req, opts);

    const update = (id: string, req: UpdateUomRequest, opts?: RequestOptions) =>
        updateRequest(id, req, opts);

    const deleteUom = (id: string, opts?: RequestOptions) =>
        deleteRequest(id, opts);

    return { findAll, findById, create, update, deleteUom };
};
