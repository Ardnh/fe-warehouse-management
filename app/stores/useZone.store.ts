import { INITIAL_PAGINATION } from '~/constants'
import { ZONE_KEYS } from '~/constants/zone.constant'
import { useZoneRepository } from '~/repositories'
import { cleanObject } from '~/utils'
import type { BaseParams, CreateZoneRequest, Pagination, UpdateZoneRequest, Zone } from '~/models'

export const useZoneStore = defineStore('zone', () => {
    const repository = useZoneRepository()
    const { run, isLoading } = useAsync()

    const zones = ref<Zone[]>([])
    const zone = ref<Zone | null>(null)
    const pagination = ref<Pagination>({ ...INITIAL_PAGINATION })

    const findByWarehouseId = async (query: BaseParams, warehouseId: string) => {
        const result = await run(ZONE_KEYS.findAll, (signal) => repository.findByWarehouseId(cleanObject(query), warehouseId, { signal }))
        if (!result.ok) return result
        zones.value = result.data.data
        pagination.value = result.data.pagination
        return result
    }

    const findById = async (id: string) => {
        const result = await run(ZONE_KEYS.findById, (signal) => repository.findById(id, { signal }))
        if (!result.ok) return result
        zone.value = result.data.data
        return result
    }
    const create = async (payload: CreateZoneRequest) => run(ZONE_KEYS.create, (signal) => repository.create(payload, { signal }))
    const update = async (id: string, payload: UpdateZoneRequest) => run(ZONE_KEYS.update, (signal) => repository.update(id, payload, { signal }))
    const deleteZone = async (id: string) => run(ZONE_KEYS.remove, (signal) => repository.delete(id, { signal }))
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
    }
})
