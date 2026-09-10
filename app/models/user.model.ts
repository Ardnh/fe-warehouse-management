import type { BaseResponse, BasePagination } from "./common.model";

export interface UserResponse extends BaseResponse, BasePagination {
    data: User[];
}

export interface UserByIdResponse extends BaseResponse {
    data: User;
}

export interface User {
    id: string;
    username: string;
    email: string;
    full_name: string;
    status: string;
    created_at: string;
    updated_at: string;
    role_ids?: string[];
}

export interface CreateUserRequest {
    username: string;
    email: string;
    password: string;
    full_name: string;
    status: string;
    role_ids: string[];
}

export interface UpdateUserRequest {
    username: string;
    email: string;
    password: string;
    full_name: string;
    status: string;
    role_ids: string[];
}
