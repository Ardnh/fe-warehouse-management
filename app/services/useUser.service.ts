import type {
    BaseParams,
    CreateUserRequest,
    UpdateUserRequest,
} from "~/models";
import { cleanObject } from "~/utils/object.utils";
import { useUserRepository } from "~/repositories";
import type { RequestOptions } from "~/constants";

export const useUserService = () => {
    const { FindAll, FindById, Create, Update, Delete } = useUserRepository();

    const findAll = async (params: BaseParams, opts?: RequestOptions) => {
        const result = await FindAll(cleanObject(params), opts);
        return result;
    };

    const findById = async (id: string, opts?: RequestOptions) => {
        const result = await FindById(id, opts);
        return result;
    };

    const create = async (req: CreateUserRequest, opts?: RequestOptions) => {
        const result = await Create(req, opts);
        return result;
    };

    const update = async (
        id: string,
        req: UpdateUserRequest,
        opts?: RequestOptions,
    ) => {
        const result = await Update(id, req, opts);
        return result;
    };

    const deleteUser = async (id: string, opts?: RequestOptions) => {
        const result = await Delete(id, opts);
        return result;
    };

    return {
        findAll,
        findById,
        create,
        update,
        deleteUser,
    };
};
