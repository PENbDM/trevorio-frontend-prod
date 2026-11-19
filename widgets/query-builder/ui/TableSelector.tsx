import { Search } from "lucide-react";
import type { DatasourceTable } from "@/entities/datasource";

type Props = {
    tables: DatasourceTable[];
    search: string;
    setSearch: (value: string) => void;
    onSelect: (table: DatasourceTable) => void;
};

export default function TableSelector({
    tables,
    search,
    setSearch,
    onSelect,
}: Props) {
    return (
        <div className="relative z-50 mt-2 w-[290px] overflow-hidden rounded-[7px] border border-[#d8dbe0] bg-white shadow-[0_5px_15px_rgba(0,0,0,0.18)]">
            <div className="p-2">
                <div className="flex h-[42px] items-center gap-2 rounded-[6px] border border-[#d7dae0] px-3">
                    <Search size={18} className="text-[#3f668f]" />

                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        autoFocus
                        placeholder="Search"
                        className="h-full min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#94969d]"
                    />
                </div>
            </div>

            <div className="bg-[#e1e4e7] px-3 py-2 text-[12px] text-[#686b73]">
                tables
            </div>

            <div className="py-1">
                {tables.length === 0 ? (
                    <div className="px-4 py-5 text-[12px] text-[#8a8c93]">
                        No tables found.
                    </div>
                ) : (
                    tables.map((table) => (
                        <button
                            key={table.id}
                            type="button"
                            onClick={() => onSelect(table)}
                            className="block w-full px-5 py-3 text-left text-[13px] text-[#41688f] transition hover:bg-[#f2f5f8]"
                        >
                            {table.name}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
