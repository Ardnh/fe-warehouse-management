import { INITIAL_PAGINATION } from '~/constants'
import { LOCATION_KEYS } from '~/constants/location.constant'
import { useLocationRepository } from '~/repositories'
import { cleanObject } from '~/utils'
import type { BaseParams, CreateLocationRequest, Location, Pagination, UpdateLocationRequest } from '~/models'

export const useLocationStore = defineStore('location', () => {
    const locationRepository = useLocationRepository()
    const { run, isLoading } = useAsync()

    const locations = ref<Location[]>([])
    const location = ref<Location | null>(null)
    const locationPagination = ref<Pagination>({ ...INITIAL_PAGINATION })

    const findAllLocations = async (query: BaseParams) => {
        const result = await run(LOCATION_KEYS.findAll, (signal) => locationRepository.findAll(cleanObject(query), { signal }))
        if (!result.ok) return result

        locations.value = result.data.data
        locationPagination.value = result.data.pagination
    }

    const findById = async (id: string) => {
        const result = await run(LOCATION_KEYS.findById, (signal) => locationRepository.findById(id, { signal }))
        return result
    }

    const create = async (payload: CreateLocationRequest) => {
        const result = await run(LOCATION_KEYS.create, (signal) => locationRepository.create(payload, { signal }))
        return result
    }

    const update = async (id: string, payload: UpdateLocationRequest) => {
        const result = await run(LOCATION_KEYS.update, (signal) => locationRepository.update(id, payload, { signal }))
        return result
    }

    const deleteLocation = async (id: string) => {
        const result = await run(LOCATION_KEYS.remove, (signal) => locationRepository.delete(id, { signal }))
        return result
    }

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
    }
})
