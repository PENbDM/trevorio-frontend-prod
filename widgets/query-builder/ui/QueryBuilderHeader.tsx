import { ChevronLeft } from "lucide-react";

type Props = {
    queryStarted: boolean;
    onStartQuery: () => void;
};

export default function QueryBuilderHeader({
    queryStarted,
    onStartQuery,
}: Props) {
    return (
        <div className="flex h-[52px] items-center justify-between border-b border-[#e6e7ea] px-4">
            <button
                type="button"
                onClick={onStartQuery}
                className="rounded-full border border-[#dce1e7] bg-white px-4 py-2 text-[13px] font-medium text-[#44678d] transition hover:bg-[#f7f8fa]"
            >
                Start new query
            </button>

            <div className="flex items-center gap-3">
                <span className="text-[11px] font-medium uppercase tracking-[0.3px] text-[#8a8c94]">
                    {queryStarted ? "1 query step" : "0 query steps"}
                </span>

                <button
                    type="button"
                    className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#e0e1e5] text-[#555b66] hover:bg-[#f5f5f7]"
                    aria-label="Collapse query builder"
                >
                    <ChevronLeft size={15} />
                </button>
            </div>
        </div>
    );
}
