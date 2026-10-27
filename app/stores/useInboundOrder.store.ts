import { INITIAL_PAGINATION } from '~/constants'
import { INBOUND_ORDER_KEYS } from '~/constants/inbound-order.constant'
import { useInboundOrderRepository } from '~/repositories'
import { cleanObject } from '~/utils'
import type {
    BaseParams,
    CreateInboundOrderItemRequest,
    CreateInboundOrderRequest,
    InboundOrder,
    InboundOrderItem,
    Pagination,
    UpdateInboundOrderItemRequest,
    UpdateInboundOrderRequest,
    UpdateInboundOrderStatusRequest,
} from '~/models'

export const useInboundOrderStore = defineStore('inboundOrder', () => {
    const repository = useInboundOrderRepository()
    const { run, isLoading } = useAsync()

    const orders = ref<InboundOrder[]>([])
    const order = ref<InboundOrder | null>(null)
    const items = ref<InboundOrderItem[]>([])
    const pagination = ref<Pagination>({ ...INITIAL_PAGINATION })

    const findAll = async (query: BaseParams) => {
        const result = await run(INBOUND_ORDER_KEYS.findAll, (signal) => repository.findAll(cleanObject(query), { signal }))
        if (!result.ok) return
        orders.value = result.data.data
        pagination.value = result.data.pagination
        return result
    }
    const findById = async (id: string) => {
        const result = await run(INBOUND_ORDER_KEYS.findById, (signal) => repository.findById(id, { signal }))
        if (!result.ok) return
        order.value = result.data.data
        return result
    }
    const create = async (payload: CreateInboundOrderRequest) => {
        const result = await run(INBOUND_ORDER_KEYS.create, (signal) => repository.create(payload, { signal }))
        return result
    }
    const update = async (id: string, payload: UpdateInboundOrderRequest) => {
        const result = await run(INBOUND_ORDER_KEYS.update, (signal) => repository.update(id, payload, { signal }))
        return result
    }
    const updateStatus = async (id: string, payload: UpdateInboundOrderStatusRequest) => {
        const result = await run(INBOUND_ORDER_KEYS.updateStatus, (signal) => repository.updateStatus(id, payload, { signal }))
        return result
    }
    const deleteOrder = async (id: string) => {
        const result = await run(INBOUND_ORDER_KEYS.remove, (signal) => repository.delete(id, { signal }))
        return result
    }
    const findAllItems = async (id: string) => {
        const result = await run(INBOUND_ORDER_KEYS.items, (signal) => repository.findAllItems(id, { signal }))
        if (!result.ok) return result
        items.value = result.data.data
        return result
    }
    const createItem = async (id: string, payload: CreateInboundOrderItemRequest) => {
        const result = await run(INBOUND_ORDER_KEYS.createItem, (signal) => repository.createItem(id, payload, { signal }))
        return result
    }
    const updateItem = async (id: string, itemId: string, payload: UpdateInboundOrderItemRequest) => {
        const result = await run(INBOUND_ORDER_KEYS.updateItem, (signal) => repository.updateItem(id, itemId, payload, { signal }))
        return result
    }
    const deleteItem = async (id: string, itemId: string) => {
        const result = await run(INBOUND_ORDER_KEYS.removeItem, (signal) => repository.deleteItem(id, itemId, { signal }))
        return result
    }

    return {
        orders,
        order,
        items,
        pagination,
        findAll,
        findById,
        create,
        update,
        updateStatus,
        deleteOrder,
        findAllItems,
        createItem,
        updateItem,
        deleteItem,
        isLoading,
    }
})
