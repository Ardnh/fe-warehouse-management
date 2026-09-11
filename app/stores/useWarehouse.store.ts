import { INITIAL_PAGINATION } from "~/constants";
import { WAREHOUSE_KEYS } from "~/constants/warehouse.constant";
import { useWarehouseService } from "~/services";
import type {
    BaseParams,
    CreateWarehouseRequest,
    Pagination,
    UpdateWarehouseRequest,
    Warehouse,
} from "~/models";

export const useWarehouseStore = defineStore("warehouse", () => {
    const warehouseService = useWarehouseService();
    const { run, isLoading, getError, clearError } = useAsync();

    const warehouses = ref<Warehouse[]>([]);
    const warehouse = ref<Warehouse | null>(null);
    const warehousePagination = ref<Pagination>({ ...INITIAL_PAGINATION });

    const findAllWarehouses = async (query: BaseParams) => {
        const result = await run(WAREHOUSE_KEYS.findAll, (signal) =>
            warehouseService.findAll(query, { signal }),
        );
        if (!result) return;

        warehouses.value = result.data;
        warehousePagination.value = result.pagination;
        return result.data;
    };

    const findById = async (id: string) => {
        const result = await run(WAREHOUSE_KEYS.findById, (signal) =>
            warehouseService.findById(id, { signal }),
        );
        if (!result) return;

        warehouse.value = result.data;
        return result.data;
    };

    const create = async (payload: CreateWarehouseRequest) => {
        const result = await run(WAREHOUSE_KEYS.create, (signal) =>
            warehouseService.create(payload, { signal }),
        );
        return result?.message;
    };

    const update = async (id: string, payload: UpdateWarehouseRequest) => {
        const result = await run(WAREHOUSE_KEYS.update, (signal) =>
            warehouseService.update(id, payload, { signal }),
        );
        return result?.message;
    };

    const deleteWarehouse = async (id: string) => {
        const result = await run(WAREHOUSE_KEYS.remove, (signal) =>
            warehouseService.deleteWarehouse(id, { signal }),
        );
        return result?.message;
    };

    return {
        warehouses,
        warehouse,
        warehousePagination,
        findAllWarehouses,
        findById,
        create,
        update,
        deleteWarehouse,
        isLoading,
        getError,
        clearError,
    };
});
