"use client";

import type { DatasourceTable } from "@/entities/datasource";
import type { RunQueryResponse } from "@/features/query-run/model/types";

import { useQueryBuilder } from "../model/useQueryBuilder";

import QueryBuilderHeader from "./QueryBuilderHeader";
import StartFromStep from "./StartFromStep";


type Props = {
    datasourceId: string;
    tables: DatasourceTable[];

    onSelectTable: (
        table: DatasourceTable
    ) => void;

    onQueryResult: (
        result: RunQueryResponse
    ) => void;

    onQueryStart: () => void;
    onSqlRun: (sql: string) => void;
};


export default function QueryBuilder({
                                         datasourceId,
                                         tables,
                                         onSelectTable,
                                         onQueryResult,
                                         onQueryStart,
                                         onSqlRun,
                                     }: Props) {

    const builder =
        useQueryBuilder(tables);

    const handleSelectTable = (
        table: DatasourceTable
    ) => {
        builder.selectTable(table);

        onSelectTable(table);
    };


    return (
        <aside
            className="
                fixed
                left-[52px]
                top-0
                z-40
                h-screen
                w-[380px]
                border-r
                border-[#e5e6e9]
                bg-white
            "
        >
            <QueryBuilderHeader
                queryStarted={
                    builder.queryStarted
                }
                onStartQuery={
                    builder.startQuery
                }
            />


            {!builder.queryStarted ? (

                <div className="relative px-4 pt-2">

                    <div
                        className="
                            absolute
                            left-[43px]
                            top-0
                            h-0
                            w-0
                            border-x-[9px]
                            border-b-[10px]
                            border-x-transparent
                            border-b-[#3e638c]
                        "
                    />

                    <button
                        type="button"
                        onClick={
                            builder.startQuery
                        }
                        className="
                            mt-2
                            w-[225px]
                            rounded-[5px]
                            bg-[#3e638c]
                            px-5
                            py-4
                            text-left
                            text-[13px]
                            font-semibold
                            text-white
                        "
                    >
                        Click here to start a new query
                    </button>

                </div>

            ) : (

                <StartFromStep
                    datasourceId={
                        datasourceId
                    }

                    sourceType={
                        builder.sourceType
                    }

                    selectedTable={
                        builder.selectedTable
                    }

                    tableDropdownOpen={
                        builder.tableDropdownOpen
                    }

                    tables={
                        builder.filteredTables
                    }

                    search={
                        builder.search
                    }

                    setSearch={
                        builder.setSearch
                    }

                    onChooseSource={
                        builder.chooseSource
                    }

                    onSelectTable={
                        handleSelectTable
                    }

                    onQueryResult={
                        onQueryResult
                    }

                    onQueryStart={
                        onQueryStart
                    }
                    onSqlRun={onSqlRun}
                />

            )}
        </aside>
    );
}