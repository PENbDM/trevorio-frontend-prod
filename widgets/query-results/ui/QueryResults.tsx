
"use client";

import type { RunQueryResponse } from "@/features/query-run";

import PaginationQueryResults from
        "@/widgets/query-results/ui/PaginationQueryResults";

type QueryMode = "browse" | "latest";
type RowId = string | number;

type Props = {
    result: RunQueryResponse;
    currentPage: number;
    onPageChange: (page: number) => void;
    queryMode?: QueryMode;
    onModeChange?: (mode: QueryMode) => void;
    showModeSwitcher?: boolean;
    onRefresh?: () => void;

    // New props for live updates
    newRowIds?: RowId[];
    isLiveRefreshing?: boolean;
};

export default function QueryResults({
                                         result,
                                         currentPage,
                                         onPageChange,
                                         queryMode = "browse",
                                         onModeChange,
                                         showModeSwitcher = false,
                                         onRefresh,
                                         newRowIds = [],
                                         isLiveRefreshing = false,
                                     }: Props) {
    const tableName =
        result.table?.name ?? "Query results";

    const schemaName = result.table?.schema_name;

    // Convert IDs to strings for reliable comparison.
    const newIds = new Set(newRowIds.map(String));

    const isLatestMode =
        showModeSwitcher && queryMode === "latest";

    const visibleNewCount = isLatestMode
        ? result.rows.filter(
            (row) =>
                row.id != null &&
                newIds.has(String(row.id))
        ).length
        : 0;

    return (
        <div className="min-h-screen bg-white">
            {/* TABLE HEADER */}

            <div className="border-b border-[#e5e7eb] px-8 py-5">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-[22px] font-semibold text-[#343641]">
                            {tableName}
                        </h1>

                        {schemaName && result.table?.name && (
                            <div className="mt-1 text-[12px] text-[#8a8d96]">
                                {schemaName}.{result.table.name}
                            </div>
                        )}
                    </div>

                    {isLatestMode && (
                        <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-[11px] font-medium text-emerald-700">
                                Live updates
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* BROWSE / LATEST SWITCHER */}

            {showModeSwitcher && onModeChange && (
                <div className="flex items-center gap-3 border-b border-[#e5e7eb] px-8 py-4">
                    <button
                        type="button"
                        onClick={() => onModeChange("browse")}
                        className={`rounded-md px-5 py-2.5 text-[13px] font-medium transition ${
                            queryMode === "browse"
                                ? "bg-[#3e638c] text-white"
                                : "border border-[#e5e7eb] bg-white text-[#60636c] hover:bg-[#f7f8fa]"
                        }`}
                    >
                        Browse Pages
                    </button>

                    <button
                        type="button"
                        onClick={() => onModeChange("latest")}
                        className={`rounded-md px-5 py-2.5 text-[13px] font-medium transition ${
                            queryMode === "latest"
                                ? "bg-[#3e638c] text-white"
                                : "border border-[#e5e7eb] bg-white text-[#60636c] hover:bg-[#f7f8fa]"
                        }`}
                    >
                        Latest Rows
                    </button>

                    <span className="ml-auto text-[12px] text-[#8a8d96]">
                        {queryMode === "latest"
                            ? "Newest IDs first"
                            : "Oldest IDs first"}
                    </span>
                </div>
            )}

            {!showModeSwitcher && (
                <div className="border-b border-[#e5e7eb] px-8 py-3 text-[12px] text-[#70737c]">
                    SQL results · Set ORDER BY in your SQL to choose
                    oldest or latest rows.
                </div>
            )}

            {/* QUERY INFORMATION */}

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e7eb] px-5 py-3">
                <span className="text-[12px] text-[#70737c]">
                    Returned {result.row_count ?? 0} results in{" "}
                    {((result.duration_ms ?? 0) / 1000).toFixed(2)} s
                </span>

                {isLatestMode && (
                    <div className="flex items-center gap-3">
                        {visibleNewCount > 0 && (
                            <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                <span className="text-[11px] font-medium text-emerald-700">
                                    {visibleNewCount} new{" "}
                                    {visibleNewCount === 1
                                        ? "row"
                                        : "rows"}
                                </span>
                            </div>
                        )}

                        {isLiveRefreshing && (
                            <div className="flex items-center gap-2 text-[11px] text-[#777]">
                                <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#d1d5db] border-t-[#3e638c]" />
                                Updating...
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* RESULTS TABLE */}

            <div className="overflow-auto">
                <table className="min-w-full border-collapse">
                    <thead className="bg-[#f7f8fa]">
                    <tr>
                        {result.columns?.map((column) => (
                            <th
                                key={column.id}
                                className="whitespace-nowrap border-b border-r border-[#e5e7eb] px-4 py-3 text-left text-[12px] font-medium text-[#60636c]"
                            >
                                {column.name}

                                <div className="mt-1 text-[10px] font-normal text-[#a0a2a8]">
                                    {column.data_type}
                                </div>
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody>
                    {result.rows?.map((row, rowIndex) => {
                        const isNew =
                            isLatestMode &&
                            row.id != null &&
                            newIds.has(String(row.id));

                        return (
                            <tr
                                key={
                                    row.id != null
                                        ? String(row.id)
                                        : rowIndex
                                }
                                className={`transition-colors duration-300 ${
                                    isNew
                                        ? "bg-emerald-50/70 hover:bg-emerald-100/60"
                                        : "hover:bg-[#fafbfc]"
                                }`}
                            >
                                {result.columns?.map((column) => {
                                    const value = row[column.name];

                                    const showNewBadge =
                                        isNew &&
                                        column.name === "id";

                                    return (
                                        <td
                                            key={column.id}
                                            className={`whitespace-nowrap border-b border-r px-4 py-3 text-[12px] ${
                                                isNew
                                                    ? "border-emerald-100 text-[#344f43]"
                                                    : "border-[#eceef1] text-[#45474f]"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                    <span>
                                                        {value === null
                                                            ? "NULL"
                                                            : String(
                                                                value ?? ""
                                                            )}
                                                    </span>

                                                {showNewBadge && (
                                                    <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                                            New
                                                        </span>
                                                )}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>

                {/* PAGINATION */}

                <div className="flex h-[100px] items-center">
                    <PaginationQueryResults
                        currentPage={currentPage}
                        totalPages={
                            result.pagination?.total_pages ?? 1
                        }
                        totalRows={
                            result.pagination?.total_rows ?? 0
                        }
                        rowCount={result.row_count ?? 0}
                        durationMs={result.duration_ms ?? 0}
                        onPageChange={onPageChange}
                        onRefresh={onRefresh}
                    />
                </div>
            </div>
        </div>
    );
}
