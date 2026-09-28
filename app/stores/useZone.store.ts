import { INITIAL_PAGINATION } from "~/constants";
import { ZONE_KEYS } from "~/constants/zone.constant";
import { useZoneService } from "~/services";
import type {
    BaseParams,
    CreateZoneRequest,
    Pagination,
    UpdateZoneRequest,
    Zone,
} from "~/models";
export const useZoneStore = defineStore("zone", () => {
    const service = useZoneService();
    const { run, isLoading, getError, clearError } = useAsync();
    const zones = ref<Zone[]>([]);
    const zone = ref<Zone | null>(null);
    const pagination = ref<Pagination>({ ...INITIAL_PAGINATION });
    const findByWarehouseId = async (
        query: BaseParams,
        warehouseId: string,
    ) => {
        const result = await run(ZONE_KEYS.findAll, (signal) =>
            service.findAllByWarehouseId(query, warehouseId, { signal }),
        );
        if (!result) return;
        zones.value = result.data;
        pagination.value = result.pagination;
        return result.data;
    };

    const findById = async (id: string) => {
        const result = await run(ZONE_KEYS.findById, (signal) =>
            service.findById(id, { signal }),
        );
        if (!result) return;
        zone.value = result.data;
        return result.data;
    };
    const create = async (payload: CreateZoneRequest) =>
        (
            await run(ZONE_KEYS.create, (signal) =>
                service.create(payload, { signal }),
            )
        )?.message;
    const update = async (id: string, payload: UpdateZoneRequest) =>
        (
            await run(ZONE_KEYS.update, (signal) =>
                service.update(id, payload, { signal }),
            )
        )?.message;
    const deleteZone = async (id: string) =>
        (
            await run(ZONE_KEYS.remove, (signal) =>
                service.deleteZone(id, { signal }),
            )
        )?.message;
    return {
        zones,
        zone,
        pagination,
        findByWarehouseId,
        findById,
        create,
        update,
        deleteZone,
        isLoading,
        getError,
        clearError,
    };
});
