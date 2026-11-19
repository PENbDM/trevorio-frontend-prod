export type QueryFilterOperator =
    | "="
    | "!="
    | ">"
    | ">="
    | "<"
    | "<="
    | "contains"
    | "is_null"
    | "is_not_null";

export type QueryFilter = {
    column_id: string;
    operator: QueryFilterOperator;
    value?: unknown;
};

export type QueryOrderBy = {
    column_id: string;
    direction: "asc" | "desc";
};


export type RunRawQueryPayload = {
    datasource_id: string;
    sql: string;
};
export type RunRawQueryPayloadPagination = {
    datasource_id: string;
    sql: string;
    page: number;
    page_size: number;
};

export type QueryResultColumn = {
    id: string;
    name: string;
    data_type: string;
};

export type QueryResultTable = {
    name: string;
    schema_name?: string;
};

export type QueryPagination = {
    page: number;
    page_size: number;
    total_rows: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
};


export type RunQueryResponse = {
    columns: QueryResultColumn[];
    rows: Record<string, unknown>[];
    row_count: number;

    pagination: QueryPagination;

    duration_ms: number;
    source?: string;
    table?: QueryResultTable;
};

export type QueuedQueryResponse = {
    status: "queued";
    task_id: string;
};

export type RunRawQueryResponse =
    | RunQueryResponse
    | QueuedQueryResponse;

export type QueryTaskResponse = {
    status:
        | "queued"
        | "running"
        | "completed"
        | "failed";
    task_id: string;
    result?: RunQueryResponse;
    error?: string;
};

export type RunQueryPayload = {
    datasource_id: string;
    table_id: string;
    column_ids: string[];

    filters?: QueryFilter[];
    order_by?: QueryOrderBy;

    page?: number;
    page_size?: number;
};
