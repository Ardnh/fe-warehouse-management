import { INITIAL_PAGINATION } from "~/constants";
import { INBOUND_ORDER_KEYS } from "~/constants/inbound-order.constant";
import { useInboundOrderService } from "~/services";
import type { BaseParams, CreateInboundOrderItemRequest, CreateInboundOrderRequest, InboundOrder, InboundOrderItem, Pagination, UpdateInboundOrderItemRequest, UpdateInboundOrderRequest, UpdateInboundOrderStatusRequest } from "~/models";

export const useInboundOrderStore = defineStore("inboundOrder", () => {
    const service = useInboundOrderService();
    const { run, isLoading, getError, clearError } = useAsync();
    const orders = ref<InboundOrder[]>([]);
    const order = ref<InboundOrder | null>(null);
    const items = ref<InboundOrderItem[]>([]);
    const pagination = ref<Pagination>({ ...INITIAL_PAGINATION });
    const findAll = async (query: BaseParams) => { const result = await run(INBOUND_ORDER_KEYS.findAll, (signal) => service.findAll(query, { signal })); if (!result) return; orders.value = result.data; pagination.value = result.pagination; return result.data; };
    const findById = async (id: string) => { const result = await run(INBOUND_ORDER_KEYS.findById, (signal) => service.findById(id, { signal })); if (!result) return; order.value = result.data; return result.data; };
    const create = async (payload: CreateInboundOrderRequest) => (await run(INBOUND_ORDER_KEYS.create, (signal) => service.create(payload, { signal })))?.message;
    const update = async (id: string, payload: UpdateInboundOrderRequest) => (await run(INBOUND_ORDER_KEYS.update, (signal) => service.update(id, payload, { signal })))?.message;
    const updateStatus = async (id: string, payload: UpdateInboundOrderStatusRequest) => (await run(INBOUND_ORDER_KEYS.updateStatus, (signal) => service.updateStatus(id, payload, { signal })))?.message;
    const deleteOrder = async (id: string) => (await run(INBOUND_ORDER_KEYS.remove, (signal) => service.deleteOrder(id, { signal })))?.message;
    const findAllItems = async (id: string) => { const result = await run(INBOUND_ORDER_KEYS.items, (signal) => service.findAllItems(id, { signal })); if (!result) return; items.value = result.data; return result.data; };
    const createItem = async (id: string, payload: CreateInboundOrderItemRequest) => (await run(INBOUND_ORDER_KEYS.createItem, (signal) => service.createItem(id, payload, { signal })))?.message;
    const updateItem = async (id: string, itemId: string, payload: UpdateInboundOrderItemRequest) => (await run(INBOUND_ORDER_KEYS.updateItem, (signal) => service.updateItem(id, itemId, payload, { signal })))?.message;
    const deleteItem = async (id: string, itemId: string) => (await run(INBOUND_ORDER_KEYS.removeItem, (signal) => service.deleteItem(id, itemId, { signal })))?.message;
    return { orders, order, items, pagination, findAll, findById, create, update, updateStatus, deleteOrder, findAllItems, createItem, updateItem, deleteItem, isLoading, getError, clearError };
});
