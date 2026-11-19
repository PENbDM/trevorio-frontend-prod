
import type { ReactNode } from "react";
import { AppSidebar } from "@/widgets/app-sidebar";

interface Props {
    children: ReactNode;
    params: Promise<{
        id: string;
    }>;
}

export default async function DatasourceLayout({
                                                   children,
                                                   params,
                                               }: Props) {
    const { id } = await params;

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <AppSidebar datasourceId={id} />

            <div className="ml-[52px] min-h-screen">
                {children}
            </div>
        </div>
    );
}