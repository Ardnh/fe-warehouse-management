import type { BaseResponse, BasePagination, BaseParams } from './common.model'

export interface PermissionsResponse extends BaseResponse, BasePagination {
    data: Permission[]
}

export interface PermissionsResponseById {
    success: boolean
    message: string
    data: Permission
}

export interface Permission {
    id: string
    resource: string
    action: string
    description: string
}

export type PermissionGroup = {
    label: string
    value: string
}[]

// Request
export interface CreateUpdatePermissionRequest {
    resource: string
    action: string
    description: string
}

// Params
export interface FindAllPermissionParams extends BaseParams {
    search?: string
    sort_by?: string
    sort_dir?: string
}
