"use client";

import { useMemo, useState } from "react";
import type { DatasourceTable } from "@/entities/datasource";
import type { SourceType } from "./types";

export function useQueryBuilder(tables: DatasourceTable[]) {
    const [queryStarted, setQueryStarted] = useState(false);
    const [sourceType, setSourceType] = useState<SourceType>("table");
    const [tableDropdownOpen, setTableDropdownOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedTable, setSelectedTable] = useState<string | null>(null);

    const filteredTables = useMemo(() => {
        const value = search.trim().toLowerCase();

        if (!value) {
            return tables;
        }

        return tables.filter((table) =>
            table.name.toLowerCase().includes(value)
        );
    }, [tables, search]);

    const startQuery = () => {
        setQueryStarted(true);
        setSourceType("table");
        setTableDropdownOpen(true);
    };

    const chooseSource = (source: SourceType) => {
        setSourceType(source);
        setTableDropdownOpen(source === "table");
    };

    const selectTable = (table: DatasourceTable) => {
        setSelectedTable(table.name);
        setTableDropdownOpen(false);
    };

    return {
        queryStarted,
        sourceType,
        tableDropdownOpen,
        search,
        selectedTable,
        filteredTables,
        setSearch,
        startQuery,
        chooseSource,
        selectTable,
    };
}
