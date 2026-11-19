import { useMutation } from "@tanstack/react-query";

import {
    runQuery,
    runRawQuery,
    runRawQueryPagination,
    runLatestQuery,
} from "../api/query-run.api";

import type {
    RunQueryPayload,
    RunRawQueryPayload,
    RunRawQueryPayloadPagination,
} from "./types";


export function useRunQuery() {
    return useMutation({
        mutationFn: (
            payload: RunQueryPayload
        ) => runQuery(payload),
    });
}


export function useRunRawQuery() {
    return useMutation({
        mutationFn: (
            payload: RunRawQueryPayload
        ) => runRawQuery(payload),
    });
}

export function useRunRawQueryPagination() {
    return useMutation({
        mutationFn: (
            payload: RunRawQueryPayloadPagination
        ) => runRawQueryPagination(payload),
    })
}
export function useRunLatestQuery() {
    return useMutation({
        mutationFn: (
            payload: RunQueryPayload
        ) => runLatestQuery(payload),
    });
}