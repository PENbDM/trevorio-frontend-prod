"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";
export default function DatasourcesLayout({
                                              children,
                                          }: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const {
        isAuthenticated,
        isLoading,
    } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/login/sign-in");
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}