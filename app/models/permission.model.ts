import type { BaseResponse, BasePagination } from "./common.model";

export interface PermissionsResponse extends BaseResponse, BasePagination {
    data: Permission[];
}

export interface PermissionsResponseById {
    success: boolean;
    message: string;
    data: Permission;
}

export interface Permission {
    group: string;
    action: PermissionAction[];
}

export interface PermissionAction {
    id: string;
    resource: string;
    action: string;
    description: string;
}

// Request
export interface CreateUpdatePermissionRequest {
    resource: string;
    action: string;
    description: string;
}

// Params
export interface FindAllPermissionParams {
    page: number;
    page_size: number;
    search: string;
    sort_by: string;
    sort_dir: string;
}
