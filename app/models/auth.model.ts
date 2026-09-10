import type { BaseResponse } from "./common.model";

export interface AuthResponse extends BaseResponse {
    data: AuthData;
}

export interface AuthData {
    token: string;
    expire_date: string;
}

export interface AuthLoginRequest {
    username: string;
    password: string;
}
