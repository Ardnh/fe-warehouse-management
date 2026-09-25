import type { RequestOptions } from "~/constants";
import type { BaseParams, CreateInboundOrderItemRequest, CreateInboundOrderRequest, UpdateInboundOrderItemRequest, UpdateInboundOrderRequest, UpdateInboundOrderStatusRequest } from "~/models";
import { useInboundOrderRepository } from "~/repositories";
import { cleanObject } from "~/utils";

export const useInboundOrderService = () => {
    const repo = useInboundOrderRepository();
    return {
        findAll: (params: BaseParams, opts?: RequestOptions) => repo.findAll(cleanObject(params), opts),
        findById: (id: string, opts?: RequestOptions) => repo.findById(id, opts),
        create: (req: CreateInboundOrderRequest, opts?: RequestOptions) => repo.create(req, opts),
        update: (id: string, req: UpdateInboundOrderRequest, opts?: RequestOptions) => repo.update(id, req, opts),
        updateStatus: (id: string, req: UpdateInboundOrderStatusRequest, opts?: RequestOptions) => repo.updateStatus(id, req, opts),
        deleteOrder: (id: string, opts?: RequestOptions) => repo.delete(id, opts),
        findAllItems: (id: string, opts?: RequestOptions) => repo.findAllItems(id, opts),
        findItemById: (id: string, itemId: string, opts?: RequestOptions) => repo.findItemById(id, itemId, opts),
        createItem: (id: string, req: CreateInboundOrderItemRequest, opts?: RequestOptions) => repo.createItem(id, req, opts),
        updateItem: (id: string, itemId: string, req: UpdateInboundOrderItemRequest, opts?: RequestOptions) => repo.updateItem(id, itemId, req, opts),
        deleteItem: (id: string, itemId: string, opts?: RequestOptions) => repo.deleteItem(id, itemId, opts),
    };
};
