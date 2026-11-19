"use client";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getMe,
    login,
    register,
} from "../api/auth.api";


export function useMe() {
    return useQuery({
        queryKey: ["me"],

        queryFn: async () => {
            const accessToken =
                localStorage.getItem(
                    "access_token"
                );

            if (!accessToken) {
                return null;
            }

            return getMe();
        },

        retry: false,
        refetchOnMount: "always",
        refetchOnWindowFocus: false,
    });
}


export function useLogin() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: login,

        onSuccess: async (data) => {
            localStorage.setItem(
                "access_token",
                data.access
            );

            localStorage.setItem(
                "refresh_token",
                data.refresh
            );

            await queryClient.invalidateQueries({
                queryKey: ["me"],
            });
        },
    });
}


export function useRegister() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: register,

        onSuccess: async (
            _,
            variables
        ) => {
            const loginResponse =
                await login({
                    email: variables.email,
                    password: variables.password,
                });

            localStorage.setItem(
                "access_token",
                loginResponse.access
            );

            localStorage.setItem(
                "refresh_token",
                loginResponse.refresh
            );

            await queryClient.invalidateQueries({
                queryKey: ["me"],
            });
        },
    });
}