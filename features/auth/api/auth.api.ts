import { api } from "@/shared/api/client";

import type {
    LoginData,
    LoginResponse,
    RegisterData,
    User,
} from "../model/types";


export async function login(
    data: LoginData
): Promise<LoginResponse> {
    const response = await api.post(
        "/api/auth/login/",
        data
    );

    return response.data;
}


export async function register(
    data: RegisterData
) {
    const response = await api.post(
        "/api/auth/register/",
        data
    );

    return response.data;
}


export async function getMe(): Promise<User> {
    const response = await api.get(
        "/api/auth/me/"
    );

    return response.data;
}