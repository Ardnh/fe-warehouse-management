import type { RequestOptions } from "~/constants";
import type {
    BaseParams,
    CreateZoneRequest,
    UpdateZoneRequest,
} from "~/models";
import { useZoneRepository } from "~/repositories";
import { cleanObject } from "~/utils";
export const useZoneService = () => {
    const {
        findByWarehouseId,
        findById,
        create,
        update,
        delete: deleteRequest,
    } = useZoneRepository();
    return {
        findAllByWarehouseId: (
            params: BaseParams,
            warehouseId: string,
            opts?: RequestOptions,
        ) => findByWarehouseId(cleanObject(params), warehouseId, opts),
        findById: (id: string, opts?: RequestOptions) => findById(id, opts),
        create: (req: CreateZoneRequest, opts?: RequestOptions) =>
            create(req, opts),
        update: (id: string, req: UpdateZoneRequest, opts?: RequestOptions) =>
            update(id, req, opts),
        deleteZone: (id: string, opts?: RequestOptions) =>
            deleteRequest(id, opts),
    };
};
