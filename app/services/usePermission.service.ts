import { usePermissionsRepository } from "../repositories";
import { cleanObject } from "../utils";
import type { FindAllPermissionParams } from "../models";
import type { RequestOptions } from "~/constants";

export const usePermissionService = () => {
    const { FindAll, FindById, Create } = usePermissionsRepository();

    const findAll = async (
        params: FindAllPermissionParams,
        opts: RequestOptions,
    ) => {
        const result = await FindAll(cleanObject(params), opts);
        return result;
    };

    const findById = async (id: string, opts: RequestOptions) => {
        const result = await FindById(id, opts);
        return result;
    };

    const create = async (req: any, opts: RequestOptions) => {
        const result = await Create(req, opts);
        return result;
    };

    return {
        findAll,
        findById,
        create,
    };
};
