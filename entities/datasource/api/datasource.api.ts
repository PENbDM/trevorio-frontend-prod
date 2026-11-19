import { api } from "@/shared/api/client";

import type {
    CreateDatasourcePayload,
    Datasource,
    DatasourceSchema,
} from "../model/types";


export async function createDatasource(
    data: CreateDatasourcePayload
): Promise<Datasource> {
    const response = await api.post(
        "/api/datasources/",
        data
    );

    return response.data;
}


export async function getDatasources(): Promise<
    Datasource[]
> {
    const response = await api.get(
        "/api/datasources/"
    );

    return response.data;
}


export async function deleteDatasource(
    id: string
): Promise<void> {
    await api.delete(
        `/api/datasources/${id}/`
    );
}


export async function getDatasourceSchema(
    id: string
): Promise<DatasourceSchema> {
    const response = await api.get(
        `/api/datasources/${id}/schema/`
    );

    return response.data;
}


export async function syncDatasourceSchema(
    id: string
): Promise<DatasourceSchema> {
    const response = await api.post(
        `/api/datasources/${id}/sync-schema/`
    );

    return response.data;
}