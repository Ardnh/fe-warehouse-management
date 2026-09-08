import { usePermissionsRepository } from "../repositories";
import type { FindAllPermissionParams } from "../models";
import { cleanObject } from "../utils";

export const usePermissionService = () => {
    const { FindAll, FindById, Create } = usePermissionsRepository();

    const findAll = async (params: FindAllPermissionParams) => {
        const result = await FindAll(cleanObject(params));
        return result;
    };

    const findById = async (id: string) => {
        const result = await FindById(id);
        return result;
    };

    const create = async (req: any) => {
        const result = await Create(req);
        return result;
    };

    return {
        findAll,
        findById,
        create,
    };
};
