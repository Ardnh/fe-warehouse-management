import { INITIAL_PAGINATION } from '~/constants'
import { WAREHOUSE_KEYS } from '~/constants/warehouse.constant'
import { useWarehouseRepository } from '~/repositories'
import { cleanObject } from '~/utils'
import type { BaseParams, CreateWarehouseRequest, Pagination, UpdateWarehouseRequest, Warehouse } from '~/models'

export const useWarehouseStore = defineStore('warehouse', () => {
    const warehouseRepository = useWarehouseRepository()
    const { run, isLoading } = useAsync()

    const warehouses = ref<Warehouse[]>([])
    const warehouse = ref<Warehouse | null>(null)
    const warehousePagination = ref<Pagination>({ ...INITIAL_PAGINATION })

    const findAllWarehouses = async (query: BaseParams) => {
        const result = await run(WAREHOUSE_KEYS.findAll, (signal) => warehouseRepository.findAll(cleanObject(query), { signal }))
        if (!result.ok) return result

        warehouses.value = result.data.data
        warehousePagination.value = result.data.pagination
        return result.data.data
    }

    const findById = async (id: string) => {
        const result = await run(WAREHOUSE_KEYS.findById, (signal) => warehouseRepository.findById(id, { signal }))
        if (!result.ok) return

        warehouse.value = result.data.data
        return result.data.data
    }

    const create = async (payload: CreateWarehouseRequest) => {
        return run(WAREHOUSE_KEYS.create, (signal) => warehouseRepository.create(payload, { signal }))
    }

    const update = async (id: string, payload: UpdateWarehouseRequest) => {
        return run(WAREHOUSE_KEYS.update, (signal) => warehouseRepository.update(id, payload, { signal }))
    }

    const deleteWarehouse = async (id: string) => {
        return run(WAREHOUSE_KEYS.remove, (signal) => warehouseRepository.delete(id, { signal }))
    }

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
    }
})
