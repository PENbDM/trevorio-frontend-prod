export type CreateDatasourcePayload = {
    name: string;
    database_type: "postgres";
    host: string;
    port: number;
    database_name: string;
    username: string;
    password: string;
    ssl_mode: string;
};


export type Datasource = {
    id: string;
    name: string;
    database_type: string;
    host: string;
    port: number;
    database_name: string;
    ssl_mode: string;
    status: string;
};


export type DatasourceColumn = {
    id: string;
    name: string;
    data_type: string;
    native_type: string;
    is_nullable: boolean;
    ordinal_position: number;
    is_primary_key: boolean;
};


export type DatasourceTable = {
    id: string;
    schema_name: string;
    name: string;
    columns: DatasourceColumn[];
};


export type DatasourceSchema = {
    datasource_id: string;
    datasource_name: string;
    last_schema_synced_at: string | null;
    tables: DatasourceTable[];
};