import {
    ChevronDown,
    Play,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import type {
    DatasourceTable,
} from "@/entities/datasource";

import type {
    SourceType,
} from "../model/types";

import {
    getQueryTaskStatus,
    useRunRawQuery,
    type RunQueryResponse,
} from "@/features/query-run";

import SourceButton from "./SourceButton";
import TableSelector from "./TableSelector";

type Props = {
    datasourceId: string;

    sourceType: SourceType;

    selectedTable: string | null;

    tableDropdownOpen: boolean;

    tables: DatasourceTable[];

    search: string;

    setSearch: (
        value: string
    ) => void;

    onChooseSource: (
        source: SourceType
    ) => void;

    onSelectTable: (
        table: DatasourceTable
    ) => void;

    onQueryResult: (
        result: RunQueryResponse
    ) => void;

    onQueryStart: () => void;
    onSqlRun: (sql: string) => void;
};


type QueryStatus =
    | "idle"
    | "sending"
    | "queued"
    | "running"
    | "completed"
    | "failed";


export default function StartFromStep({
                                          datasourceId,
                                          sourceType,
                                          selectedTable,
                                          tableDropdownOpen,
                                          tables,
                                          search,
                                          setSearch,
                                          onChooseSource,
                                          onSelectTable,
                                          onQueryResult,
                                          onQueryStart,
                                          onSqlRun,
                                      }: Props) {

    const [sql, setSql] =
        useState("");

    const [queryStatus, setQueryStatus] =
        useState<QueryStatus>("idle");

    const [taskId, setTaskId] =
        useState<string | null>(null);

    const [queryResult, setQueryResult] =
        useState<RunQueryResponse | null>(
            null
        );

    const [queryError, setQueryError] =
        useState<string | null>(null);


    const runRawQueryMutation =
        useRunRawQuery();


    const handleRunSql = () => {
        const trimmedSql =
            sql.trim();

        if (!trimmedSql) {
            return;
        }

        onSqlRun(trimmedSql);
        onQueryStart();
        setQueryStatus("sending");
        setQueryError(null);
        setQueryResult(null);
        setTaskId(null);

        runRawQueryMutation.mutate(
            {
                datasource_id:
                datasourceId,

                sql: trimmedSql,
            },

            {
                onSuccess: (data) => {

                    if ("task_id" in data) {
                        setTaskId(
                            data.task_id
                        );

                        setQueryStatus(
                            "queued"
                        );

                        return;
                    }


                    setQueryResult(data);
                    onQueryResult(data);

                    setQueryStatus(
                        "completed"
                    );
                },

                onError: (error) => {
                    console.error(
                        "Raw SQL error:",
                        error
                    );

                    setQueryStatus(
                        "failed"
                    );

                    setQueryError(
                        "Failed to run SQL query."
                    );
                },
            }
        );
    };


    useEffect(() => {
        if (!taskId) {
            return;
        }

        if (
            queryStatus === "completed" ||
            queryStatus === "failed"
        ) {
            return;
        }


        const interval = setInterval(
            async () => {
                try {
                    const task =
                        await getQueryTaskStatus(
                            taskId
                        );

                    if (
                        task.status === "queued"
                    ) {
                        setQueryStatus(
                            "queued"
                        );

                        return;
                    }

                    if (
                        task.status === "running"
                    ) {
                        setQueryStatus(
                            "running"
                        );

                        return;
                    }

                    if (
                        task.status ===
                        "completed"
                    ) {
                        if (task.result) {
                            setQueryResult(
                                task.result
                            );
                            onQueryResult(
                                task.result
                            );
                        }

                        setQueryStatus(
                            "completed"
                        );

                        clearInterval(
                            interval
                        );

                        return;
                    }

                    if (
                        task.status === "failed"
                    ) {
                        setQueryStatus(
                            "failed"
                        );

                        setQueryError(
                            task.error ??
                            "Query failed."
                        );

                        clearInterval(
                            interval
                        );
                    }

                } catch (error) {
                    console.error(
                        "Task status error:",
                        error
                    );
                }
            },

            1000
        );


        return () => {
            clearInterval(
                interval
            );
        };

    }, [
        taskId,
        queryStatus,
        onQueryResult,
    ]);


    const isBusy =
        queryStatus === "sending" ||
        queryStatus === "queued" ||
        queryStatus === "running";


    return (
        <div className="px-3 py-4">

            <div className="flex items-start gap-2">

                <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded border border-[#e2e3e6] bg-white text-[12px] text-[#48698b]">
                    1
                </div>


                <div className="min-w-0 flex-1">

                    <div className="flex">

                        <div className="flex h-[30px] items-center rounded-l border border-[#e2e3e6] bg-[#f5f6f7] px-3 text-[11px] font-semibold text-[#555761]">
                            start from
                        </div>


                        <SourceButton
                            active={
                                sourceType ===
                                "table"
                            }

                            onClick={() =>
                                onChooseSource(
                                    "table"
                                )
                            }
                        >
                            Table

                            <ChevronDown
                                size={12}
                            />
                        </SourceButton>


                        <SourceButton
                            active={
                                sourceType ===
                                "sql"
                            }

                            onClick={() =>
                                onChooseSource(
                                    "sql"
                                )
                            }
                        >
                            SQL
                        </SourceButton>


                        <SourceButton
                            active={
                                sourceType ===
                                "csv"
                            }

                            onClick={() =>
                                onChooseSource(
                                    "csv"
                                )
                            }
                        >
                            CSV
                        </SourceButton>


                        <SourceButton
                            active={
                                sourceType ===
                                "saved"
                            }

                            onClick={() =>
                                onChooseSource(
                                    "saved"
                                )
                            }
                        >
                            Saved query

                            <ChevronDown
                                size={12}
                            />
                        </SourceButton>

                    </div>


                    {selectedTable && (
                        <div className="mt-3 rounded-md border border-[#dfe3e8] bg-[#f8fafc] px-3 py-2">

                            <div className="text-[11px] text-[#8a8d96]">
                                Table
                            </div>

                            <div className="mt-1 text-[13px] font-medium text-[#41688f]">
                                {selectedTable}
                            </div>

                        </div>
                    )}


                    {sourceType === "table" &&
                        tableDropdownOpen && (

                            <TableSelector
                                tables={tables}
                                search={search}
                                setSearch={
                                    setSearch
                                }
                                onSelect={
                                    onSelectTable
                                }
                            />

                        )}


                    {sourceType === "sql" && (

                        <div className="mt-3">

                            <textarea
                                value={sql}

                                onChange={(
                                    event
                                ) => {
                                    setSql(
                                        event
                                            .target
                                            .value
                                    );
                                }}

                                placeholder="Write SQL..."

                                className="h-[150px] w-full resize-none rounded-md border border-[#dfe1e5] bg-white p-3 font-mono text-[12px] outline-none focus:border-[#7c9fc1]"
                            />


                            {queryStatus !==
                                "idle" && (

                                    <div className="mt-2 text-[12px] text-[#666]">

                                        Status:{" "}

                                        <strong>
                                            {
                                                queryStatus
                                            }
                                        </strong>

                                    </div>
                                )}


                            {taskId && (

                                <div className="mt-1 break-all text-[10px] text-[#999]">

                                    Task: {taskId}

                                </div>
                            )}


                            {queryError && (

                                <div className="mt-2 text-[12px] text-red-500">

                                    {
                                        queryError
                                    }

                                </div>
                            )}


                            {queryResult && (

                                <div className="mt-2 rounded border border-[#dfe3e8] bg-[#f8fafc] p-2 text-[11px]">

                                    <div>
                                        Rows:{" "}
                                        {
                                            queryResult
                                                .row_count
                                        }
                                    </div>

                                    <div>
                                        Duration:{" "}
                                        {
                                            queryResult
                                                .duration_ms
                                        }{" "}
                                        ms
                                    </div>

                                </div>
                            )}


                            <div className="mt-2 flex justify-end">

                                <button
                                    type="button"

                                    onClick={
                                        handleRunSql
                                    }

                                    disabled={
                                        !sql.trim() ||
                                        isBusy
                                    }

                                    className="flex h-[32px] items-center gap-1.5 rounded-md bg-[#48698b] px-4 text-[12px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    <Play
                                        size={13}
                                    />


                                    {queryStatus ===
                                    "sending"
                                        ? "Sending..."

                                        : queryStatus ===
                                        "queued"
                                            ? "Queued"

                                            : queryStatus ===
                                            "running"
                                                ? "Running..."

                                                : "Run SQL"
                                    }

                                </button>

                            </div>

                        </div>
                    )}


                    {sourceType === "csv" && (

                        <div className="mt-3 rounded-md border border-dashed border-[#ccd1d7] p-5 text-center text-[12px] text-[#7c7e86]">

                            CSV import will be
                            added later.

                        </div>

                    )}

                    {sourceType === "saved" && (

                        <div className="mt-3 rounded-md border border-[#e1e3e7] p-4 text-[12px] text-[#777a82]">

                            No saved queries yet.

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}