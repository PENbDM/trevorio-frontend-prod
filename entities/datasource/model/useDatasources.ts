"use client";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    createDatasource,
    deleteDatasource,
    getDatasources,
    getDatasourceSchema,
    syncDatasourceSchema,
} from "../api/datasource.api";

import type {
    CreateDatasourcePayload,
} from "./types";


export function useDatasources() {
    return useQuery({
        queryKey: ["datasources"],
        queryFn: getDatasources,
    });
}


export function useCreateDatasource() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            data: CreateDatasourcePayload
        ) => createDatasource(data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["datasources"],
            });
        },
    });
}


export function useDeleteDatasource() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            id: string
        ) => deleteDatasource(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["datasources"],
            });
        },
    });
}


export function useDatasourceSchema(
    datasourceId: string
) {
    return useQuery({
        queryKey: [
            "datasource-schema",
            datasourceId,
        ],

        queryFn: () =>
            getDatasourceSchema(
                datasourceId
            ),

        enabled: !!datasourceId,
    });
}


export function useSyncDatasourceSchema(
    datasourceId: string
) {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: () =>
            syncDatasourceSchema(
                datasourceId
            ),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [
                    "datasource-schema",
                    datasourceId,
                ],
            });
        },
    });
}