import type { BaseResponse, BasePagination } from './common.model'
import type { Location, Role } from './'

export interface UserResponse extends BaseResponse, BasePagination {
    data: User[]
}

export interface UserByIdResponse extends BaseResponse {
    data: User
}

export interface User {
    id: string
    username: string
    email: string
    full_name: string
    status: string
    location: Location
    roles: Role
    created_at: string
    updated_at: string
}

export interface CreateUserRequest {
    username: string
    email: string
    password: string
    full_name: string
    status: string
    role_ids: string[]
}

export interface UpdateUserRequest {
    username: string
    email: string
    password: string
    full_name: string
    status: string
    role_ids: string[]
}

export interface UserProfileResponse extends BaseResponse {
    data: UserProfile
}

export interface UserProfile {
    id: string
    username: string
    email: string
    full_name: string
    status: string
    location: Location
    roles: Role
    permissions: string[]
    created_at: string
    updated_at: string
}
