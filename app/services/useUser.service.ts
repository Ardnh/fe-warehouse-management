import type {
    BaseParams,
    CreateUserRequest,
    UpdateUserRequest,
} from "~/models";
import { cleanObject } from "~/utils/object.utils";
import { useUserRepository } from "~/repositories";

export const useUserService = () => {
    const { FindAll, FindById, Create, Update, Delete } = useUserRepository();

    const findAll = async (params: BaseParams) => {
        const result = await FindAll(cleanObject(params));
        return result;
    };

    const findById = async (id: string) => {
        const result = await FindById(id);
        return result;
    };

    const create = async (req: CreateUserRequest) => {
        const result = await Create(req);
        return result;
    };

    const update = async (id: string, req: UpdateUserRequest) => {
        const result = await Update(id, req);
        return result;
    };

    const deleteUser = async (id: string) => {
        const result = await Delete(id);
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
