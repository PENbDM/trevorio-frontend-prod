type Props = {
    onRefresh: () => void;
    isRefreshing: boolean;
};

export default function EmptyDatabase({
    onRefresh,
    isRefreshing,
}: Props) {
    return (
        <main className="ml-[52px] min-h-screen">
            <div className="flex min-h-screen items-center justify-center">
                <div className="-mt-10 w-full max-w-[640px]">
                    <h1 className="text-[42px] font-semibold tracking-[-1px] text-[#17191c]">
                        Your database is empty
                    </h1>

                    <p className="mt-7 text-[21px] text-[#17191c]">
                        Once your database is populated with data, click the button below.
                    </p>

                    <button
                        type="button"
                        disabled={isRefreshing}
                        onClick={onRefresh}
                        className="mt-8 rounded-full bg-[#ffc233] px-4 py-2 text-sm font-medium text-[#315b8c] transition hover:bg-[#f5b923] disabled:opacity-50"
                    >
                        {isRefreshing ? "Refreshing..." : "Refresh"}
                    </button>
                </div>
            </div>
        </main>
    );
}
