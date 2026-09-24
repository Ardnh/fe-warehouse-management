import type { RequestOptions } from "~/constants";
import type {
    BaseParams,
    CreateLocationRequest,
    UpdateLocationRequest,
} from "~/models";
import { useLocationRepository } from "~/repositories";
import { cleanObject } from "~/utils";

export const useLocationService = () => {
    const { findAll, findById, create, update, delete: deleteRequest } =
        useLocationRepository();

    const findAllLocations = (params: BaseParams, opts?: RequestOptions) =>
        findAll(cleanObject(params), opts);
    const findLocationById = (id: string, opts?: RequestOptions) =>
        findById(id, opts);
    const createLocation = (req: CreateLocationRequest, opts?: RequestOptions) =>
        create(req, opts);
    const updateLocation = (
        id: string,
        req: UpdateLocationRequest,
        opts?: RequestOptions,
    ) => update(id, req, opts);
    const deleteLocation = (id: string, opts?: RequestOptions) =>
        deleteRequest(id, opts);

    return {
        findAllLocations,
        findLocationById,
        createLocation,
        updateLocation,
        deleteLocation,
    };
};
