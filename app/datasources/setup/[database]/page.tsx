"use client";

import {
    useParams,
    useSearchParams,
} from "next/navigation";
import { DatabaseSetupForm } from "@/features/datasource-connect";

export default function SetupPage() {
    const params = useParams<{ database: string }>();
    const searchParams = useSearchParams();
    const provider = searchParams.get("provider");

    return (
        <DatabaseSetupForm
            database={params.database}
            provider={provider}
        />
    );
}
