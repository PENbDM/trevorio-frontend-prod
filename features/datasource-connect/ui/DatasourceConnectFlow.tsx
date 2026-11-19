"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import CredentialsStep from "./CredentialsStep";
import DatabaseTypeStep from "./DatabaseTypeStep";
import HostingProviderStep from "./HostingProviderStep";

type Props = {
    onClose: () => void;
};

export default function DatasourceConnectFlow({
                                                  onClose,
                                              }: Props) {
    const router = useRouter();

    const [credentials, setCredentials] =
        useState<string | null>(null);

    const [database, setDatabase] =
        useState<string | null>(null);

    const [provider, setProvider] =
        useState<string | null>(null);

    const handleContinue = () => {
        if (!database || !provider) {
            return;
        }

        router.push(
            `/datasources/setup/${database}?provider=${provider}`
        );
    };

    return (
        <div className="mt-12 flex w-full max-w-[800px] flex-col gap-10">
            <CredentialsStep
                value={credentials}
                onClose={onClose}
                onChange={(value) => {
                    setCredentials(value);
                    setDatabase(null);
                    setProvider(null);
                }}
            />

            {credentials === "know" && (
                <DatabaseTypeStep
                    value={database}
                    onChange={(value) => {
                        setDatabase(value);
                        setProvider(null);
                    }}
                />
            )}

            {database && (
                <HostingProviderStep
                    value={provider}
                    onChange={setProvider}
                />
            )}

            {database && provider && (
                <div className="flex justify-center pb-4">
                    <button
                        type="button"
                        onClick={handleContinue}
                        className="
                            flex items-center
                            gap-4
                            rounded-full
                            bg-[#ffc438]
                            px-8 py-4
                            text-[18px]
                            font-medium
                            text-[#35658d]
                            transition
                            hover:bg-[#f5b92d]
                        "
                    >
                        Continue to next step

                        <span className="text-[25px]">
                            →
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
}