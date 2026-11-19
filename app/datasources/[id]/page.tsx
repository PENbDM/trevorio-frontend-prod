"use client";

import { useParams } from "next/navigation";
import { DatasourceWorkspace } from "@/widgets/datasource-workspace";

export default function DatasourceWorkspacePage() {
    const params = useParams<{ id: string }>();

    return (
        <DatasourceWorkspace
            datasourceId={params.id}
        />
    );
}
