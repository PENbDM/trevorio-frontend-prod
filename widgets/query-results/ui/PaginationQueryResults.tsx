import Image from "next/image";


type Props = {
    currentPage: number;

    totalPages: number;

    totalRows: number;

    rowCount: number;

    durationMs: number;
    onRefresh?: () => void;

    onPageChange: (
        page: number
    ) => void;
};


function PaginationQueryResults({
                                    currentPage,
                                    totalPages,
                                    totalRows,
                                    rowCount,
                                    durationMs,
                                    onPageChange,
                                    onRefresh,
                                }: Props) {

    const handlePrevious = () => {
        if (currentPage <= 1) {
            return;
        }

        onPageChange(
            currentPage - 1
        );
    };


    const handleNext = () => {
        if (
            currentPage >=
            totalPages
        ) {
            return;
        }

        onPageChange(
            currentPage + 1
        );
    };


    return (
        <div className="flex items-center w-full">

            <div className="w-1/2 flex ml-10">

                <p>
                    Returned{" "}
                    {rowCount} of{" "}
                    {totalRows} results in{" "}
                    {(
                        durationMs / 1000
                    ).toFixed(2)}
                    s
                </p>

                <button type="button" onClick={onRefresh} disabled={!onRefresh} className="ml-5 disabled:opacity-40">
                    Refresh Results
                </button>

            </div>


            <div className="w-1/2 flex items-center justify-end gap-4 mr-20">

                {currentPage > 1 && (

                    <Image
                        src="/pagingationQueryResult/left-arrow.png"
                        alt="Previous page"
                        width={20}
                        height={20}
                        className="cursor-pointer"
                        onClick={
                            handlePrevious
                        }
                    />

                )}


                <span>
                    Page {currentPage} of{" "}
                    {totalPages}
                </span>


                {currentPage < totalPages && (

                    <Image
                        src="/pagingationQueryResult/right-arrow.png"
                        alt="Next page"
                        width={20}
                        height={20}
                        className="cursor-pointer"
                        onClick={
                            handleNext
                        }
                    />

                )}

            </div>

        </div>
    );
}


export default PaginationQueryResults;