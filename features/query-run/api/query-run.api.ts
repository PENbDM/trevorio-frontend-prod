import { api } from "@/shared/api/client";

import {
    RunQueryPayload,
    RunQueryResponse,
    RunRawQueryPayload,
    RunRawQueryResponse,
    QueryTaskResponse, RunRawQueryPayloadPagination,
} from "../model/types";


export async function runQuery(
    payload: RunQueryPayload
): Promise<RunQueryResponse> {
    const response = await api.post(
        "/api/queries/run/",
        payload
    );

    return response.data;
}


export async function runRawQuery(
    payload: RunRawQueryPayload
): Promise<RunRawQueryResponse> {
    const response = await api.post(
        "/api/queries/run/raw/",
        payload
    );

    return response.data;
}


export async function getQueryTaskStatus(
    taskId: string
): Promise<QueryTaskResponse> {
    const response = await api.get(
        `/api/queries/tasks/${taskId}/`
    );

    return response.data;
}

//pagination

export async function runRawQueryPagination(
    payload: RunRawQueryPayloadPagination
): Promise<RunRawQueryResponse> {
    const response = await api.post(
        "/api/queries/run/raw/",
        payload
    );
    return response.data;
}

export async function runLatestQuery(
    payload: RunQueryPayload
): Promise<RunQueryResponse> {
    const response = await api.post(
        "/api/queries/run/latest/",
        payload
    );

    return response.data;
}