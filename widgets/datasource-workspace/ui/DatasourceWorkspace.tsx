
"use client";

import { useEffect, useRef, useState } from "react";

import type { DatasourceTable } from "@/entities/datasource";

import {
    useDatasourceSchema,
    useSyncDatasourceSchema,
} from "@/entities/datasource";

import {
    useRunQuery,
    useRunLatestQuery,
    runRawQueryPagination,
    getQueryTaskStatus,
    type RunQueryResponse,
    type RunRawQueryResponse,
} from "@/features/query-run";

import { QueryBuilder } from "@/widgets/query-builder";
import { QueryResults } from "@/widgets/query-results";

import { sendTrackingUserDatasourceTable } from
        "../../../features/tracking/api/tracking.api";

import {
    connectSSE,
    type DetectionNotification,
} from "@/shared/api/sse";

import EmptyDatabase from "./EmptyDatabase";

type Props = {
    datasourceId: string;
};

type QueryMode = "browse" | "latest";

type RowId = string | number;

export default function DatasourceWorkspace({
                                                datasourceId,
                                            }: Props) {
    // ------------------------------------
    // DATASOURCE SCHEMA
    // ------------------------------------

    const {
        data: schema,
        isLoading,
        isError,
    } = useDatasourceSchema(datasourceId);

    const syncMutation = useSyncDatasourceSchema(datasourceId);

    // ------------------------------------
    // QUERY MUTATIONS
    // ------------------------------------

    const runQuery = useRunQuery();
    const runLatestQuery = useRunLatestQuery();

    // ------------------------------------
    // WORKSPACE STATE
    // ------------------------------------

    const [currentPage, setCurrentPage] = useState(1);

    const [queryMode, setQueryMode] =
        useState<QueryMode>("browse");

    const [selectedTable, setSelectedTable] =
        useState<DatasourceTable | null>(null);

    const [activeResult, setActiveResult] =
        useState<RunQueryResponse | null>(null);

    const [queryPending, setQueryPending] = useState(false);
    const [queryError, setQueryError] = useState(false);

    // Newly detected IDs for row highlighting.
    const [newRowIds, setNewRowIds] = useState<RowId[]>([]);

    // Background refresh indicator.
    const [isLiveRefreshing, setIsLiveRefreshing] =
        useState(false);

    // Prevent stale requests replacing newer results.
    const requestId = useRef(0);
    const rawSqlRef = useRef<string | null>(null);

    const tables = schema?.tables ?? [];

    const selectedTableId = selectedTable?.id ?? null;

    // ------------------------------------
    // ACTIVE USER SESSION HEARTBEAT
    // ------------------------------------

    useEffect(() => {
        if (!selectedTable) return;

        const sendHeartbeat = () => {
            const payload = {
                datasource_id: datasourceId,
                table_id: selectedTable.id,
                column_ids: selectedTable.columns.map(
                    (column) => column.id
                ),
            };

            void Promise.resolve(
                sendTrackingUserDatasourceTable(payload)
            ).catch((error) => {
                console.error("Tracking heartbeat failed:", error);
            });
        };

        // The existing query handler sends the initial tracking request.
        // This interval keeps the session alive.
        const intervalId = setInterval(sendHeartbeat, 20000);

        return () => {
            clearInterval(intervalId);
        };
    }, [datasourceId, selectedTable]);

    // ------------------------------------
    // RESOLVE CELERY QUERY RESULTS
    // ------------------------------------

    const resolveQueryResult = async (
        response: RunRawQueryResponse
    ): Promise<RunQueryResponse> => {
        if (!("task_id" in response)) {
            return response;
        }

        for (let attempt = 0; attempt < 120; attempt++) {
            const status = await getQueryTaskStatus(
                response.task_id
            );

            if (status.status === "completed") {
                if (!status.result) {
                    throw new Error(
                        "Completed task has no result"
                    );
                }

                return status.result;
            }

            if (status.status === "failed") {
                throw new Error(
                    status.error ?? "Query task failed"
                );
            }

            await new Promise<void>((resolve) =>
                setTimeout(resolve, 1000)
            );
        }

        throw new Error("Query task timed out");
    };

    // ------------------------------------
    // EXECUTE TABLE QUERY
    // ------------------------------------

    const runTableQuery = async (
        table: DatasourceTable,
        page: number,
        mode: QueryMode
    ) => {
        const currentRequest = ++requestId.current;

        setActiveResult(null);
        setQueryPending(true);
        setQueryError(false);
        setNewRowIds([]);

        const payload = {
            datasource_id: datasourceId,
            table_id: table.id,
            column_ids: table.columns.map(
                (column) => column.id
            ),
            filters: [],
            page,
            page_size: 100,
        };

        void Promise.resolve(
            sendTrackingUserDatasourceTable(payload)
        ).catch((error) => {
            console.error("Tracking request failed:", error);
        });

        try {
            const response =
                mode === "latest"
                    ? await runLatestQuery.mutateAsync(payload)
                    : await runQuery.mutateAsync(payload);

            if (currentRequest !== requestId.current) return;

            const resolved = await resolveQueryResult(response);

            if (currentRequest !== requestId.current) return;

            setActiveResult(resolved);
        } catch (error) {
            if (currentRequest !== requestId.current) return;

            console.error("Query failed:", error);
            setQueryError(true);
        } finally {
            if (currentRequest === requestId.current) {
                setQueryPending(false);
            }
        }
    };

    // ------------------------------------
    // SSE LIVE ROW DETECTION
    // ------------------------------------

    useEffect(() => {
        // Connect only while a table is selected.
        if (!selectedTable || !selectedTableId) {
            return;
        }

        // Prevent overlapping SSE-triggered requests.
        let refreshInProgress = false;
        let disposed = false;

        const onDetection = async (
            notification: DetectionNotification
        ) => {
            // Check datasource.`
            if (notification.datasource_id !== datasourceId) {
                return;
            }

            // Check selected table.
            if (notification.table_id !== selectedTableId) {
                return;
            }

            // Automatic refresh only in Latest Rows mode.
            if (queryMode !== "latest") {
                return;
            }

            // Don't refresh if there are no new IDs.
            if (notification.new_row_ids.length === 0) {
                return;
            }

            if (refreshInProgress) {
                return;
            }

            refreshInProgress = true;

            const currentRequest = requestId.current;

            console.log(
                "Refreshing latest rows:",
                notification.new_row_ids
            );

            setIsLiveRefreshing(true);

            const payload = {
                datasource_id: datasourceId,
                table_id: selectedTable.id,
                column_ids: selectedTable.columns.map(
                    (column) => column.id
                ),
                filters: [],
                page: 1,
                page_size: 100,
            };

            try {
                const response =
                    await runLatestQuery.mutateAsync(payload);

                const resolved =
                    await resolveQueryResult(response);

                // Ignore stale responses after changing tables/modes.
                if (
                    disposed ||
                    currentRequest !== requestId.current
                ) {
                    return;
                }

                setCurrentPage(1);
                setActiveResult(resolved);

                // Keep the currently visible, newly detected IDs.
                const visibleIds = new Set(
                    resolved.rows.map((row) => String(row.id))
                );

                setNewRowIds((previous) => {
                    const combined = [
                        ...previous,
                        ...notification.new_row_ids,
                    ];

                    return Array.from(
                        new Set(combined.map(String))
                    ).filter((id) => visibleIds.has(id));
                });

                console.log(
                    "Latest rows updated without page reload"
                );
            } catch (error) {
                if (!disposed) {
                    console.error(
                        "Live refresh failed:",
                        error
                    );
                }
            } finally {
                refreshInProgress = false;

                if (!disposed) {
                    setIsLiveRefreshing(false);
                }
            }
        };

        const sse = connectSSE(onDetection);

        return () => {
            disposed = true;
            sse.close();
        };
    }, [
        datasourceId,
        selectedTable,
        selectedTableId,
        queryMode,
        runLatestQuery.mutateAsync,
    ]);

    // ------------------------------------
    // USER SELECTS A TABLE
    // ------------------------------------

    const handleSelectTable = (
        table: DatasourceTable
    ) => {
        rawSqlRef.current = null;

        // Invalidate any older query response.
        ++requestId.current;

        setSelectedTable(table);
        setCurrentPage(1);
        setQueryMode("browse");
        setNewRowIds([]);

        void runTableQuery(table, 1, "browse");
    };

    // ------------------------------------
    // CHANGE BROWSE / LATEST MODE
    // ------------------------------------

    const handleModeChange = (mode: QueryMode) => {
        if (!selectedTable) return;

        ++requestId.current;

        setQueryMode(mode);
        setCurrentPage(1);
        setNewRowIds([]);

        void runTableQuery(selectedTable, 1, mode);
    };

    // ------------------------------------
    // PAGINATION
    // ------------------------------------

    const handlePageChange = (page: number) => {
        if (!selectedTable && !rawSqlRef.current) {
            return;
        }

        setCurrentPage(page);
        setNewRowIds([]);

        if (!selectedTable && rawSqlRef.current) {
            void runRawPage(page);
            return;
        }

        if (!selectedTable) return;

        void runTableQuery(
            selectedTable,
            page,
            queryMode
        );
    };

    // ------------------------------------
    // RAW SQL PAGINATION
    // ------------------------------------

    const runRawPage = async (page: number) => {
        const sql = rawSqlRef.current;
        if (!sql) return;

        const currentRequest = ++requestId.current;

        setQueryPending(true);
        setQueryError(false);
        setNewRowIds([]);

        try {
            const response = await runRawQueryPagination({
                datasource_id: datasourceId,
                sql,
                page,
                page_size: 100,
            });

            const resolved = await resolveQueryResult(response);

            if (currentRequest !== requestId.current) {
                return;
            }

            setActiveResult(resolved);
        } catch (error) {
            if (currentRequest !== requestId.current) {
                return;
            }

            console.error("Raw SQL pagination failed:", error);
            setQueryError(true);
        } finally {
            if (currentRequest === requestId.current) {
                setQueryPending(false);
            }
        }
    };

    const handleSqlRun = (sql: string) => {
        ++requestId.current;

        rawSqlRef.current = sql;
        setSelectedTable(null);
        setCurrentPage(1);
        setNewRowIds([]);
    };

    // ------------------------------------
    // MANUAL REFRESH
    // ------------------------------------

    const refreshResults = () => {
        setNewRowIds([]);

        if (selectedTable) {
            void runTableQuery(
                selectedTable,
                currentPage,
                queryMode
            );
        } else if (rawSqlRef.current) {
            void runRawPage(currentPage);
        }
    };

    // ------------------------------------
    // QUERY BUILDER RESULTS
    // ------------------------------------

    const handleExternalQueryResult = (
        result: RunQueryResponse
    ) => {
        ++requestId.current;

        setSelectedTable(null);
        setActiveResult(result);
        setQueryPending(false);
        setQueryError(false);
        setNewRowIds([]);
        setCurrentPage(result.pagination?.page ?? 1);
    };

    const handleExternalQueryStart = () => {
        ++requestId.current;

        setSelectedTable(null);
        setActiveResult(null);
        setQueryPending(false);
        setQueryError(false);
        setNewRowIds([]);
    };

    // ------------------------------------
    // LOADING DATASOURCE
    // ------------------------------------

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading datasource...
            </div>
        );
    }

    // ------------------------------------
    // ERROR LOADING DATASOURCE
    // ------------------------------------

    if (isError) {
        return (
            <div className="flex min-h-screen items-center justify-center text-red-500">
                Failed to load datasource.
            </div>
        );
    }

    // ------------------------------------
    // RENDER WORKSPACE
    // ------------------------------------

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {tables.length === 0 ? (
                <EmptyDatabase
                    isRefreshing={syncMutation.isPending}
                    onRefresh={() => syncMutation.mutate()}
                />
            ) : (
                <div className="min-h-screen">
                    <QueryBuilder
                        datasourceId={datasourceId}
                        tables={tables}
                        onSelectTable={handleSelectTable}
                        onQueryResult={handleExternalQueryResult}
                        onQueryStart={handleExternalQueryStart}
                        onSqlRun={handleSqlRun}
                    />

                    <main className="ml-[380px] min-h-screen bg-[#fafafa]">
                        {queryPending ? (
                            <div className="flex min-h-screen items-center justify-center text-[14px] text-[#777]">
                                Running query...
                            </div>
                        ) : queryError ? (
                            <div className="flex min-h-screen items-center justify-center text-[14px] text-red-500">
                                Query failed.
                            </div>
                        ) : activeResult ? (
                            <QueryResults
                                result={activeResult}
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                                onRefresh={refreshResults}
                                queryMode={queryMode}
                                onModeChange={handleModeChange}
                                showModeSwitcher={
                                    selectedTable !== null
                                }
                                newRowIds={newRowIds}
                                isLiveRefreshing={
                                    isLiveRefreshing
                                }
                            />
                        ) : (
                            <div className="min-h-screen" />
                        )}
                    </main>
                </div>
            )}
        </div>
    );
}
