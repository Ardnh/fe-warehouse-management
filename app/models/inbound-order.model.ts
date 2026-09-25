import type { BasePagination, BaseResponse } from "./common.model";

export interface InboundOrderResponse extends BaseResponse, BasePagination {
    data: InboundOrder[];
}
export interface InboundOrderByIdResponse extends BaseResponse {
    data: InboundOrder;
}
export interface InboundOrder {
    id: string;
    customer_id: string;
    order_number: string;
    status: string;
    expected_arrival_at?: string | null;
    notes?: string | null;
    created_at: string;
    updated_at: string;
    items?: InboundOrderItem[];
}
export interface InboundOrderItem {
    id: string;
    inbound_order_id: string;
    product_id: string;
    expected_qty: number;
    created_at: string;
    updated_at: string;
}
export interface InboundOrderItemResponse extends BaseResponse {
    data: InboundOrderItem[];
}
export interface InboundOrderItemByIdResponse extends BaseResponse {
    data: InboundOrderItem;
}
export interface CreateInboundOrderItemRequest {
    product_id: string;
    expected_qty: number;
}
export interface UpdateInboundOrderItemRequest {
    id?: string;
    product_id: string;
    expected_qty: number;
}
export interface CreateInboundOrderRequest {
    customer_id: string;
    expected_arrival_at?: string;
    notes?: string;
    items: CreateInboundOrderItemRequest[];
}
export interface UpdateInboundOrderRequest {
    customer_id?: string;
    expected_arrival_at?: string;
    notes?: string;
    items?: UpdateInboundOrderItemRequest[];
}
export interface UpdateInboundOrderStatusRequest {
    status: string;
    notes?: string;
}
