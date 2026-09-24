import type {
    BaseParams,
    CreateUserRequest,
    UpdateUserRequest,
} from "~/models";
import { cleanObject } from "~/utils/object.utils";
import { useUserRepository } from "~/repositories";
import type { RequestOptions } from "~/constants";

export const useUserService = () => {
    const {
        findAll: findAllRequest,
        findById: findByIdRequest,
        findProfile: findProfileRequest,
        create: createRequest,
        update: updateRequest,
        delete: deleteRequest,
    } = useUserRepository();

    const findAll = async (params: BaseParams, opts?: RequestOptions) => {
        const result = await findAllRequest(cleanObject(params), opts);
        return result;
    };

    const findById = async (id: string, opts?: RequestOptions) => {
        const result = await findByIdRequest(id, opts);
        return result;
    };

    const findProfile = async (opts?: RequestOptions) => {
        const result = await findProfileRequest(opts);
        return result;
    };

    const create = async (req: CreateUserRequest, opts?: RequestOptions) => {
        const result = await createRequest(req, opts);
        return result;
    };

    const update = async (
        id: string,
        req: UpdateUserRequest,
        opts?: RequestOptions,
    ) => {
        const result = await updateRequest(id, req, opts);
        return result;
    };

    const deleteUser = async (id: string, opts?: RequestOptions) => {
        const result = await deleteRequest(id, opts);
        return result;
    };

    return {
        findAll,
        findById,
        findProfile,
        create,
        update,
        deleteUser,
    };
};
