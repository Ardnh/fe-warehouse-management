import { INITIAL_PAGINATION } from '~/constants'
import { UOM_KEYS } from '~/constants/uom.constant'
import { useUomRepository } from '~/repositories'
import { cleanObject } from '~/utils'
import type { BaseParams, CreateUomRequest, Pagination, Uom, UpdateUomRequest } from '~/models'

export const useUomStore = defineStore('uom', () => {
    const uomRepository = useUomRepository()
    const { run, isLoading } = useAsync()

    const uoms = ref<Uom[]>([])
    const uom = ref<Uom | null>(null)
    const uomPagination = ref<Pagination>({ ...INITIAL_PAGINATION })

    const findAllUoms = async (query: BaseParams) => {
        const result = await run(UOM_KEYS.findAll, (signal) => uomRepository.findAll(cleanObject(query), { signal }))
        if (!result.ok) return result

        uoms.value = result.data.data
        uomPagination.value = result.data.pagination
        return result.data.data
    }

    const findById = async (id: string) => {
        const result = await run(UOM_KEYS.findById, (signal) => uomRepository.findById(id, { signal }))
        if (!result.ok) return

        uom.value = result.data.data
        return result.data.data
    }

    const create = async (payload: CreateUomRequest) => {
        return run(UOM_KEYS.create, (signal) => uomRepository.create(payload, { signal }))
    }

    const update = async (id: string, payload: UpdateUomRequest) => {
        return run(UOM_KEYS.update, (signal) => uomRepository.update(id, payload, { signal }))
    }

    const deleteUom = async (id: string) => {
        return run(UOM_KEYS.remove, (signal) => uomRepository.delete(id, { signal }))
    }

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
    }
})
