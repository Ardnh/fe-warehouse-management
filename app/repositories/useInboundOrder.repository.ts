import { useApi } from "~/composables";
import type { RequestOptions } from "~/constants";
import type {
    BaseResponse,
    CreateInboundOrderItemRequest,
    CreateInboundOrderRequest,
    InboundOrderByIdResponse,
    InboundOrderItemByIdResponse,
    InboundOrderItemResponse,
    InboundOrderResponse,
    UpdateInboundOrderRequest,
    UpdateInboundOrderStatusRequest,
    UpdateInboundOrderItemRequest,
} from "~/models";

export const useInboundOrderRepository = () => {
    const { api } = useApi();
    return {
        findAll: (query: Record<string, unknown>, opts?: RequestOptions) =>
            api<InboundOrderResponse>("/inbound-order", {
                query,
                signal: opts?.signal,
            }),
        findById: (id: string, opts?: RequestOptions) =>
            api<InboundOrderByIdResponse>(`/inbound-order/${id}`, {
                signal: opts?.signal,
            }),
        create: (req: CreateInboundOrderRequest, opts?: RequestOptions) =>
            api<BaseResponse>("/inbound-order", {
                method: "POST",
                body: req,
                signal: opts?.signal,
            }),
        update: (
            id: string,
            req: UpdateInboundOrderRequest,
            opts?: RequestOptions,
        ) =>
            api<BaseResponse>(`/inbound-order/${id}`, {
                method: "PUT",
                body: req,
                signal: opts?.signal,
            }),
        updateStatus: (
            id: string,
            req: UpdateInboundOrderStatusRequest,
            opts?: RequestOptions,
        ) =>
            api<BaseResponse>(`/inbound-order/${id}/status`, {
                method: "PATCH",
                body: req,
                signal: opts?.signal,
            }),
        delete: (id: string, opts?: RequestOptions) =>
            api<BaseResponse>(`/inbound-order/${id}`, {
                method: "DELETE",
                signal: opts?.signal,
            }),
        findAllItems: (id: string, opts?: RequestOptions) =>
            api<InboundOrderItemResponse>(`/inbound-order/${id}/item`, {
                signal: opts?.signal,
            }),
        findItemById: (id: string, itemId: string, opts?: RequestOptions) =>
            api<InboundOrderItemByIdResponse>(
                `/inbound-order/${id}/item/${itemId}`,
                { signal: opts?.signal },
            ),
        createItem: (
            id: string,
            req: CreateInboundOrderItemRequest,
            opts?: RequestOptions,
        ) =>
            api<BaseResponse>(`/inbound-order/${id}/item`, {
                method: "POST",
                body: req,
                signal: opts?.signal,
            }),
        updateItem: (
            id: string,
            itemId: string,
            req: UpdateInboundOrderItemRequest,
            opts?: RequestOptions,
        ) =>
            api<BaseResponse>(`/inbound-order/${id}/item/${itemId}`, {
                method: "PUT",
                body: req,
                signal: opts?.signal,
            }),
        deleteItem: (id: string, itemId: string, opts?: RequestOptions) =>
            api<BaseResponse>(`/inbound-order/${id}/item/${itemId}`, {
                method: "DELETE",
                signal: opts?.signal,
            }),
    };
};
