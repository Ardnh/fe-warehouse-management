import { INITIAL_PAGINATION } from "~/constants";
import { UOM_KEYS } from "~/constants/uom.constant";
import { useUomService } from "~/services";
import type {
    BaseParams,
    CreateUomRequest,
    Pagination,
    Uom,
    UpdateUomRequest,
} from "~/models";

export const useUomStore = defineStore("uom", () => {
    const uomService = useUomService();
    const { run, isLoading, getError, clearError } = useAsync();

    const uoms = ref<Uom[]>([]);
    const uom = ref<Uom | null>(null);
    const uomPagination = ref<Pagination>({ ...INITIAL_PAGINATION });

    const findAllUoms = async (query: BaseParams) => {
        const result = await run(UOM_KEYS.findAll, (signal) =>
            uomService.findAll(query, { signal }),
        );
        if (!result) return;

        uoms.value = result.data;
        uomPagination.value = result.pagination;
        return result.data;
    };

    const findById = async (id: string) => {
        const result = await run(UOM_KEYS.findById, (signal) =>
            uomService.findById(id, { signal }),
        );
        if (!result) return;

        uom.value = result.data;
        return result.data;
    };

    const create = async (payload: CreateUomRequest) => {
        const result = await run(UOM_KEYS.create, (signal) =>
            uomService.create(payload, { signal }),
        );
        return result?.message;
    };

    const update = async (id: string, payload: UpdateUomRequest) => {
        const result = await run(UOM_KEYS.update, (signal) =>
            uomService.update(id, payload, { signal }),
        );
        return result?.message;
    };

    const deleteUom = async (id: string) => {
        const result = await run(UOM_KEYS.remove, (signal) =>
            uomService.deleteUom(id, { signal }),
        );
        return result?.message;
    };

    return {
        uoms,
        uom,
        uomPagination,
        findAllUoms,
        findById,
        create,
        update,
        deleteUom,
        isLoading,
        getError,
        clearError,
    };
});
