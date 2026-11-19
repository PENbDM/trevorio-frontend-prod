"use client";

import { useRouter } from "next/navigation";
import { DatasourceConnectFlow } from "@/features/datasource-connect";

export default function ConnectDatasourcePage() {
    const router = useRouter();

    return (
        <main className="min-h-dvh bg-[#fafafa] text-[#41414f]">
            <div className="mx-auto flex w-full max-w-[900px] justify-center px-5 pt-[45px]">
                <DatasourceConnectFlow
                    onClose={() => router.push("/datasources")}
                />
            </div>
        </main>
    );
}
