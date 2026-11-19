import {QueryFilter, QueryOrderBy} from "@/features/query-run";

export type TrackingQueryPayload = {
    datasource_id: string;
    table_id: string;
    column_ids: string[];

    filters?: QueryFilter[];
    order_by?: QueryOrderBy;

    page?: number;
    page_size?: number;
};
