import type { BaseParams } from "~/models";
import { useRoleRepository } from "../repositories";
import { cleanObject } from "../utils";
import type { RequestOptions } from "~/constants";

export const useRoleService = () => {
    const {
        findAll: findAllRequest,
        findById: findByIdRequest,
        create: createRequest,
        update: updateRequest,
        delete: deleteRequest,
    } = useRoleRepository();

    const findAll = async (params: BaseParams, opts?: RequestOptions) => {
        const result = await findAllRequest(cleanObject(params), opts);
        return result;
    };

    const findById = async (id: string, opts?: RequestOptions) => {
        const result = await findByIdRequest(id, opts);
        return result;
    };

    const create = async (req: any, opts?: RequestOptions) => {
        const result = await createRequest(req, opts);
        return result;
    };

    const update = async (id: string, req: any, opts?: RequestOptions) => {
        const result = await updateRequest(id, req, opts);
        return result;
    };

    const deleteRole = async (id: string, opts?: RequestOptions) => {
        const result = await deleteRequest(id, opts);
        return result;
    };

    return {
        findAll,
        findById,
        create,
        update,
        deleteRole,
    };
};
