import type { BaseParams } from "~/models";
import { useRoleRepository } from "../repositories";
import { cleanObject } from "../utils";

export const useRoleService = () => {
    const { FindAll, FindById, Create, Update, Delete } = useRoleRepository();

    const findAll = async (params: BaseParams) => {
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

    const update = async (id: string, req: any) => {
        const result = await Update(id, req);
        return result;
    };

    const deleteItem = async (id: string) => {
        const result = await Delete(id);
        return result;
    };

    return {
        findAll,
        findById,
        create,
        update,
        deleteItem,
    };
};
