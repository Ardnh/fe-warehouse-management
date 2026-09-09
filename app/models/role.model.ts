import type { BaseResponse, BasePagination } from "./common.model";

export interface RolesResponse extends BaseResponse, BasePagination {
    data: Role[];
}

export interface RolesByIdResponse extends BaseResponse {
    data: Role;
}

export interface Role {
    id: string;
    code: string;
    name: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}
