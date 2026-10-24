import type { BaseResponse, BasePagination } from './common.model'
import type { Permission } from './permission.model'

export interface RolesResponse extends BaseResponse, BasePagination {
    data: Role[]
}

export interface RolesByIdResponse extends BaseResponse {
    data: Role
}

export interface Role {
    id: string
    code: string
    name: string
    description: string
    status: string
    permissions: Permission[]
    created_at: string
    updated_at: string
}

export interface CreateRoleRequest {
    code: string
    name: string
    description: string
    status?: string
    permission_ids: string[]
}

export interface UpdateRoleRequest {
    name?: string
    description?: string
    status?: string
    permission_ids?: string[]
}
