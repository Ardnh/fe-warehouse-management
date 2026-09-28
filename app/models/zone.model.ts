import type { BasePagination, BaseResponse } from "./common.model";

export const ZONE_TYPES = [
    "RECEIVING",
    "STORAGE",
    "PACKING",
    "OUTBOUND",
    "DAMAGED",
    "STAGING",
] as const;
export const ZONE_STATUSES = ["ACTIVE", "INACTIVE"] as const;
export type ZoneType = (typeof ZONE_TYPES)[number];
export type ZoneStatus = (typeof ZONE_STATUSES)[number];

export interface Zone {
    id: string;
    warehouse_id: string;
    code: string;
    name: string;
    type: ZoneType;
    status: ZoneStatus;
    created_at: string;
    updated_at: string;
}
export interface ZoneListResponse extends BaseResponse, BasePagination {
    data: Zone[];
}
export interface ZoneByIdResponse extends BaseResponse {
    data: Zone;
}
export interface CreateZoneRequest {
    warehouse_id: string;
    code: string;
    name: string;
    type: ZoneType;
    status?: ZoneStatus;
}
export interface UpdateZoneRequest {
    code?: string;
    name?: string;
    type?: ZoneType;
    status?: ZoneStatus;
}
