import { INITIAL_PAGINATION } from "~/constants";
import { LOCATION_KEYS } from "~/constants/location.constant";
import { useLocationService } from "~/services";
import type {
    BaseParams,
    CreateLocationRequest,
    Location,
    Pagination,
    UpdateLocationRequest,
} from "~/models";

export const useLocationStore = defineStore("location", () => {
    const locationService = useLocationService();
    const { run, isLoading, getError, clearError } = useAsync();

    const locations = ref<Location[]>([]);
    const location = ref<Location | null>(null);
    const locationPagination = ref<Pagination>({ ...INITIAL_PAGINATION });

    const findAllLocations = async (query: BaseParams) => {
        const result = await run(LOCATION_KEYS.findAll, (signal) =>
            locationService.findAllLocations(query, { signal }),
        );
        if (!result) return;
        locations.value = result.data;
        locationPagination.value = result.pagination;
        return result.data;
    };

    const findById = async (id: string) => {
        const result = await run(LOCATION_KEYS.findById, (signal) =>
            locationService.findLocationById(id, { signal }),
        );
        if (!result) return;
        location.value = result.data;
        return result.data;
    };

    const create = async (payload: CreateLocationRequest) => {
        const result = await run(LOCATION_KEYS.create, (signal) =>
            locationService.createLocation(payload, { signal }),
        );
        return result?.message;
    };

    const update = async (id: string, payload: UpdateLocationRequest) => {
        const result = await run(LOCATION_KEYS.update, (signal) =>
            locationService.updateLocation(id, payload, { signal }),
        );
        return result?.message;
    };

    const deleteLocation = async (id: string) => {
        const result = await run(LOCATION_KEYS.remove, (signal) =>
            locationService.deleteLocation(id, { signal }),
        );
        return result?.message;
    };

    return {
        locations,
        location,
        locationPagination,
        findAllLocations,
        findById,
        create,
        update,
        deleteLocation,
        isLoading,
        getError,
        clearError,
    };
});
