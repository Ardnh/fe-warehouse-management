import type { RequestOptions } from "~/constants";
import type {
    BaseParams,
    CreateUomRequest,
    UpdateUomRequest,
} from "~/models";
import { useUomRepository } from "~/repositories";
import { cleanObject } from "~/utils";

export const useUomService = () => {
    const { FindAll, FindById, Create, Update, Delete } = useUomRepository();

    const findAll = (params: BaseParams, opts?: RequestOptions) =>
        FindAll(cleanObject(params), opts);

    const findById = (id: string, opts?: RequestOptions) => FindById(id, opts);

    const create = (req: CreateUomRequest, opts?: RequestOptions) =>
        Create(req, opts);

    const update = (id: string, req: UpdateUomRequest, opts?: RequestOptions) =>
        Update(id, req, opts);

    const deleteUom = (id: string, opts?: RequestOptions) => Delete(id, opts);

    return { findAll, findById, create, update, deleteUom };
};
