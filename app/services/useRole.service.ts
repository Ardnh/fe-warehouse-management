import type { BaseParams } from "~/models";
import { useRoleRepository } from "../repositories";
import { cleanObject } from "../utils";
import type { RequestOptions } from "~/constants";

export const useRoleService = () => {
    const { FindAll, FindById, Create, Update, Delete } = useRoleRepository();

    const findAll = async (params: BaseParams, opts?: RequestOptions) => {
        const result = await FindAll(cleanObject(params), opts);
        return result;
    };

    const findById = async (id: string, opts?: RequestOptions) => {
        const result = await FindById(id, opts);
        return result;
    };

    const create = async (req: any, opts?: RequestOptions) => {
        const result = await Create(req, opts);
        return result;
    };

    const update = async (id: string, req: any, opts?: RequestOptions) => {
        const result = await Update(id, req, opts);
        return result;
    };

    const deleteRole = async (id: string, opts?: RequestOptions) => {
        const result = await Delete(id, opts);
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
