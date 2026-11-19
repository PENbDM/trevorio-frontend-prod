"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useCreateDatasource } from "@/entities/datasource";

type Props = {
    database: string;
    provider: string | null;
};

export default function DatabaseSetupForm({
                                              database,
                                              provider,
                                          }: Props) {
    const router = useRouter();

    const createDatasourceMutation =
        useCreateDatasource();

    const [name, setName] = useState("");
    const [host, setHost] = useState(
        provider === "localhost"
            ? "localhost"
            : ""
    );

    const [port, setPort] = useState("5432");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [databaseName, setDatabaseName] = useState("");

    const isLocalhost = provider === "localhost";
    const isAWS = provider === "aws";

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        createDatasourceMutation.mutate(
            {
                name,
                database_type: "postgres",
                host,
                port: Number(port),
                database_name: databaseName,
                username,
                password,
                ssl_mode: isLocalhost
                    ? "disable"
                    : "require",
            },
            {
                onSuccess: (datasource) => {
                    console.log(
                        "Datasource created:",
                        datasource
                    );

                    router.push(
                        `/datasources/${datasource.id}`
                    );
                },
            }
        );
    };

    return (
        <main className="min-h-dvh bg-[#fafafa] px-5 py-10 text-[#263746]">
            <div className="mx-auto max-w-[960px]">
                {/* Back */}
                <button
                    type="button"
                    onClick={() =>
                        router.push("/datasources")
                    }
                    className="
                        rounded-full
                        border border-[#e0e4e8]
                        bg-white
                        px-4 py-2
                        text-[13px]
                        text-[#52779d]
                    "
                >
                    Back to datasources
                </button>

                {/* Title */}
                <div className="mt-6">
                    <h1 className="text-[25px] font-semibold">
                        Connect your PostgreSQL database
                    </h1>

                    <p className="mt-2 max-w-[600px] text-[15px] text-[#555563]">
                        🔒 Trevor uses a secure, read-only
                        transaction and doesn&apos;t store a copy
                        of your database.
                    </p>
                </div>

                {/* Database type */}
                <div className="mt-8 flex items-center gap-5">
                    <select
                        value={database}
                        disabled
                        className="
                            rounded-md
                            border border-[#dfe3e7]
                            bg-white
                            px-4 py-2
                            text-[14px]
                        "
                    >
                        <option value="postgres">
                            PostgreSQL
                        </option>
                    </select>

                    <label className="flex items-center gap-2 text-[14px] font-medium">
                        <input type="checkbox" />
                        Connect via SSH
                    </label>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mt-5 grid grid-cols-[1fr_230px] gap-6">
                        {/* Inputs */}
                        <div className="rounded-md border border-[#e0e3e6] bg-white p-5">
                            <div className="flex flex-col gap-4">
                                <ConnectionInput
                                    label="Nickname"
                                    placeholder="Give your datasource a name"
                                    value={name}
                                    onChange={setName}
                                />

                                <ConnectionInput
                                    label="Host"
                                    placeholder={
                                        isLocalhost
                                            ? "localhost"
                                            : isAWS
                                                ? "e.g. mydb.eu-west-2.rds.amazonaws.com"
                                                : "Database hostname"
                                    }
                                    value={host}
                                    onChange={setHost}
                                />

                                <ConnectionInput
                                    label="Port"
                                    placeholder="5432"
                                    value={port}
                                    onChange={setPort}
                                />

                                <ConnectionInput
                                    label="User"
                                    placeholder="username"
                                    value={username}
                                    onChange={setUsername}
                                />

                                <ConnectionInput
                                    label="Password"
                                    type="password"
                                    placeholder="password"
                                    value={password}
                                    onChange={setPassword}
                                />

                                <ConnectionInput
                                    label="Database"
                                    placeholder="e.g. postgres"
                                    value={databaseName}
                                    onChange={setDatabaseName}
                                />
                            </div>
                        </div>

                        {/* Right side */}
                        <aside>
                            <div className="rounded-md border border-[#e0e3e6] bg-white p-5">
                                <h3 className="text-[14px] font-semibold text-[#456b92] underline">
                                    Need help connecting?
                                </h3>

                                <p className="mt-3 text-[12px] text-gray-500">
                                    Quick links
                                </p>

                                {isAWS && (
                                    <button
                                        type="button"
                                        className="mt-2 block text-left text-[13px] text-[#52779d] underline"
                                    >
                                        Connect to PostgreSQL on AWS
                                    </button>
                                )}

                                {isLocalhost && (
                                    <button
                                        type="button"
                                        className="mt-2 block text-left text-[13px] text-[#52779d] underline"
                                    >
                                        Connect to PostgreSQL on localhost
                                    </button>
                                )}
                            </div>

                            {/* Connect */}
                            <div className="mt-4 rounded-md border border-[#e0e3e6] bg-white p-5">
                                <button
                                    type="submit"
                                    disabled={
                                        createDatasourceMutation.isPending ||
                                        !name ||
                                        !host ||
                                        !port ||
                                        !username ||
                                        !password ||
                                        !databaseName
                                    }
                                    className="
                                        w-full
                                        rounded-full
                                        bg-[#ffc438]
                                        px-5 py-3
                                        text-[13px]
                                        font-medium
                                        text-[#35658d]
                                        transition
                                        hover:bg-[#f5b92d]
                                        disabled:cursor-not-allowed
                                        disabled:bg-[#f4f5f6]
                                        disabled:text-[#c6ccd1]
                                    "
                                >
                                    {createDatasourceMutation.isPending
                                        ? "Connecting..."
                                        : "Connect database"}
                                </button>
                            </div>
                        </aside>
                    </div>

                    {/* Error */}
                    {createDatasourceMutation.isError && (
                        <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
                            Could not connect to the database.
                            Please check your connection details.
                        </div>
                    )}

                    {/* Success */}
                    {createDatasourceMutation.isSuccess && (
                        <div className="mt-5 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-[13px] text-green-700">
                            Database connected successfully.
                        </div>
                    )}
                </form>

                {/* Help */}
                <div className="mt-10">
                    <h2 className="text-[20px] font-semibold">
                        Problem connecting?
                    </h2>

                    <p className="mt-2 text-[14px]">
                        <button className="text-[#52779d] underline">
                            Chat with us.
                        </button>{" "}
                        We&apos;re happy to help.
                    </p>
                </div>
            </div>
        </main>
    );
}

type ConnectionInputProps = {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
};

function ConnectionInput({
                             label,
                             placeholder,
                             value,
                             onChange,
                             type = "text",
                         }: ConnectionInputProps) {
    return (
        <div className="grid grid-cols-[100px_1fr] items-center gap-4">
            <label className="text-[14px] font-semibold">
                {label}
            </label>

            <input
                type={type}
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                placeholder={placeholder}
                required
                className="
                    h-[42px]
                    rounded-md
                    border border-[#e2e4e7]
                    px-3
                    text-[14px]
                    outline-none
                    transition
                    focus:border-[#93b2df]
                "
            />
        </div>
    );
}