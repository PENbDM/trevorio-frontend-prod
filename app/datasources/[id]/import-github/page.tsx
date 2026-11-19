
"use client";

import { useState } from "react";
import {
    ArrowDownToLine,
    ArrowLeft,
    ArrowRight,
    BookOpen,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    CircleHelp,
    Code2,
    Database,
    ExternalLink,
    FileCode2,
    FolderOpen,
    GitBranch,
    LockKeyhole,
    Search,
    ShieldCheck,
    Sparkles,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

// ------------------------------------
// Mock data - replace with API later
// ------------------------------------

type SqlFile = {
    name: string;
    path: string;
    content: string;
};

type Repository = {
    id: number;
    name: string;
    owner: string;
    private: boolean;
    description: string;
    files: SqlFile[];
};

const repositories: Repository[] = [
    {
        id: 1,
        name: "analytics-queries",
        owner: "dmytro-dev",
        private: true,
        description: "SQL queries and reports for analytics.",
        files: [
            {
                name: "top_customers.sql",
                path: "queries/top_customers.sql",
                content: `SELECT
    u.email,
    COUNT(o.id) AS total_orders,
    SUM(o.total_amount) AS revenue
FROM users u
JOIN orders o
    ON o.user_id = u.id
GROUP BY u.id, u.email
ORDER BY revenue DESC
LIMIT 100;`,
            },
            {
                name: "monthly_revenue.sql",
                path: "queries/monthly_revenue.sql",
                content: `SELECT
    DATE_TRUNC('month', created_at) AS month,
    SUM(total_amount) AS revenue
FROM orders
GROUP BY month
ORDER BY month DESC;`,
            },
            {
                name: "product_sales.sql",
                path: "queries/product_sales.sql",
                content: `SELECT
    p.name,
    SUM(oi.quantity) AS units_sold
FROM products p
JOIN order_items oi
    ON oi.product_id = p.id
GROUP BY p.id, p.name
ORDER BY units_sold DESC;`,
            },
        ],
    },
    {
        id: 2,
        name: "nike-store",
        owner: "dmytro-dev",
        private: true,
        description: "E-commerce application and database queries.",
        files: [
            {
                name: "all_products.sql",
                path: "sql/all_products.sql",
                content: `SELECT
    id,
    name,
    price,
    stock
FROM products
ORDER BY name ASC
LIMIT 100;`,
            },
            {
                name: "recent_orders.sql",
                path: "sql/recent_orders.sql",
                content: `SELECT
    id,
    user_id,
    total_amount,
    created_at
FROM orders
ORDER BY created_at DESC
LIMIT 50;`,
            },
        ],
    },
    {
        id: 3,
        name: "sql-examples",
        owner: "dmytro-dev",
        private: false,
        description: "A collection of useful SQL examples.",
        files: [
            {
                name: "users.sql",
                path: "examples/users.sql",
                content: `SELECT
    id,
    email,
    created_at
FROM users
ORDER BY created_at DESC;`,
            },
        ],
    },
];

// ------------------------------------
// Reusable small components
// ------------------------------------

function StepIndicator({
                           number,
                           label,
                           active,
                           completed,
                       }: {
    number: number;
    label: string;
    active?: boolean;
    completed?: boolean;
}) {
    return (
        <div className="flex items-center gap-2">
            <div
                className={`
                    flex h-7 w-7 items-center justify-center
                    rounded-full text-xs font-semibold
                    ${
                    completed
                        ? "bg-[#e7f5ed] text-[#25834c]"
                        : active
                            ? "bg-[#385b83] text-white"
                            : "bg-[#f0f1f3] text-[#999]"
                }
                `}
            >
                {completed ? <Check size={14} /> : number}
            </div>

            <span
                className={`text-sm ${
                    active || completed
                        ? "font-medium text-[#263445]"
                        : "text-[#a1a7af]"
                }`}
            >
                {label}
            </span>
        </div>
    );
}

// ------------------------------------
// Page
// ------------------------------------

export default function ImportGithubPage() {
    // UI-only GitHub connection state
    const [demoConnected, setDemoConnected] = useState(false);

    // Repository and file selection
    const [search, setSearch] = useState("");
    const [selectedRepo, setSelectedRepo] =
        useState<Repository | null>(null);
    const [selectedFile, setSelectedFile] =
        useState<SqlFile | null>(null);

    // UI notification
    const [message, setMessage] = useState("");

    const filteredRepositories = repositories.filter((repo) =>
        `${repo.owner}/${repo.name}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const selectRepository = (repo: Repository) => {
        setSelectedRepo(repo);
        setSelectedFile(null);
        setMessage("");
    };

    const goBack = () => {
        if (selectedFile) {
            setSelectedFile(null);
        } else {
            setSelectedRepo(null);
        }

        setMessage("");
    };

    const currentStep = !demoConnected
        ? 1
        : !selectedRepo
            ? 2
            : !selectedFile
                ? 3
                : 4;

    return (
        <main className="min-h-screen bg-[#fafafa]">
            {/* --------------------------------
                Top navigation
            -------------------------------- */}

            <header className="flex h-[76px] items-center justify-between border-b border-[#eceef1] bg-white px-6 md:px-10">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eff4fa] text-[#3e638c]">
                        <FaGithub size={21} />
                    </div>

                    <div>
                        <h1 className="text-[16px] font-semibold text-[#202b38]">
                            Import from GitHub
                        </h1>

                        <p className="text-xs text-[#9299a3]">
                            Bring your SQL queries into Trevor
                        </p>
                    </div>
                </div>

                <span className="rounded-full border border-[#e5e9ee] bg-[#fafbfc] px-3 py-1.5 text-xs font-medium text-[#7e8995]">
                    UI Preview
                </span>
            </header>

            <div className="mx-auto max-w-[1180px] px-6 py-9 md:px-10">
                {/* --------------------------------
                    Heading
                -------------------------------- */}

                <div className="mb-8">
                    <div className="mb-3 flex items-center gap-2 text-xs font-medium text-[#9099a5]">
                        <span>Workspace</span>

                        <ChevronRight size={13} />

                        <span>Integrations</span>

                        <ChevronRight size={13} />

                        <span className="text-[#385b83]">
                            GitHub
                        </span>
                    </div>

                    <h2 className="text-[28px] font-bold tracking-tight text-[#202b38]">
                        Import SQL from GitHub
                    </h2>

                    <p className="mt-2 max-w-[670px] text-[14px] leading-6 text-[#7e8995]">
                        Find SQL files in your GitHub repositories,
                        preview their contents, and bring them into
                        your Trevor workspace.
                    </p>
                </div>

                {/* --------------------------------
                    Steps
                -------------------------------- */}

                <div className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border border-[#e9ecf0] bg-white px-6 py-5 md:gap-6">
                    <StepIndicator
                        number={1}
                        label="Connect GitHub"
                        active={currentStep === 1}
                        completed={currentStep > 1}
                    />

                    <ChevronRight
                        size={15}
                        className="hidden text-[#c9cdd3] md:block"
                    />

                    <StepIndicator
                        number={2}
                        label="Repository"
                        active={currentStep === 2}
                        completed={currentStep > 2}
                    />

                    <ChevronRight
                        size={15}
                        className="hidden text-[#c9cdd3] md:block"
                    />

                    <StepIndicator
                        number={3}
                        label="SQL file"
                        active={currentStep === 3}
                        completed={currentStep > 3}
                    />

                    <ChevronRight
                        size={15}
                        className="hidden text-[#c9cdd3] md:block"
                    />

                    <StepIndicator
                        number={4}
                        label="Import"
                        active={currentStep === 4}
                    />
                </div>

                {/* --------------------------------
                    Screen 1: Connection
                -------------------------------- */}

                {!demoConnected && (
                    <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
                        <section className="overflow-hidden rounded-2xl border border-[#e9ecf0] bg-white">
                            <div className="px-8 pb-8 pt-10 md:px-12 md:pt-12">
                                <div className="mb-7 flex h-[68px] w-[68px] items-center justify-center rounded-[20px] bg-[#f0f4fa] text-[#263445]">
                                    <FaGithub size={34} />
                                </div>

                                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#eef4fb] px-3 py-1.5 text-[11px] font-semibold text-[#46729f]">
                                    <Sparkles size={12} />
                                    NEW INTEGRATION
                                </div>

                                <h3 className="max-w-[430px] text-[26px] font-bold leading-tight text-[#202b38]">
                                    Your SQL queries,
                                    <br />
                                    all in one place.
                                </h3>

                                <p className="mt-4 max-w-[440px] text-[14px] leading-7 text-[#7e8995]">
                                    Connect your GitHub account to
                                    browse repositories and import
                                    SQL files directly into Trevor.
                                    No copying and pasting required.
                                </p>

                                <div className="mt-8 flex flex-wrap items-center gap-3">
                                    <button
                                        type="button"
                                        disabled
                                        title="GitHub authentication is not implemented yet"
                                        className="flex h-12 cursor-not-allowed items-center justify-center gap-3 rounded-xl bg-[#202b38] px-6 text-[14px] font-semibold text-white opacity-60"
                                    >
                                        <FaGithub size={20} />
                                        Connect GitHub
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setDemoConnected(true)
                                        }
                                        className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#dce3eb] bg-white px-5 text-[14px] font-semibold text-[#385b83] transition hover:bg-[#f3f7fb]"
                                    >
                                        Explore demo
                                        <ArrowRight size={16} />
                                    </button>
                                </div>

                                <p className="mt-4 text-xs text-[#a0a7b0]">
                                    GitHub authentication will be
                                    available after backend integration.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-5 border-t border-[#edf0f3] bg-[#fbfcfd] px-8 py-5 md:px-12">
                                <div className="flex items-center gap-2 text-xs text-[#738192]">
                                    <ShieldCheck
                                        size={16}
                                        className="text-[#57936a]"
                                    />
                                    Read-only access
                                </div>

                                <div className="flex items-center gap-2 text-xs text-[#738192]">
                                    <LockKeyhole
                                        size={15}
                                        className="text-[#57936a]"
                                    />
                                    Private repositories
                                </div>

                                <div className="flex items-center gap-2 text-xs text-[#738192]">
                                    <Code2
                                        size={16}
                                        className="text-[#57936a]"
                                    />
                                    SQL files
                                </div>
                            </div>
                        </section>

                        {/* Right information panel */}

                        <aside className="rounded-2xl border border-[#e9ecf0] bg-white p-7">
                            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff7df] text-[#bc8b21]">
                                <BookOpen size={21} />
                            </div>

                            <h3 className="text-[17px] font-semibold text-[#202b38]">
                                How it works
                            </h3>

                            <p className="mt-2 text-[13px] leading-6 text-[#85909c]">
                                Importing a query takes just a few
                                simple steps.
                            </p>

                            <div className="mt-8 space-y-7">
                                {[
                                    {
                                        number: "01",
                                        title: "Connect GitHub",
                                        description:
                                            "Authorise access to your selected repositories.",
                                    },
                                    {
                                        number: "02",
                                        title: "Find your SQL",
                                        description:
                                            "Browse repositories and select a SQL file.",
                                    },
                                    {
                                        number: "03",
                                        title: "Import and run",
                                        description:
                                            "Preview the query and open it in Trevor.",
                                    },
                                ].map((step) => (
                                    <div
                                        key={step.number}
                                        className="flex gap-4"
                                    >
                                        <span className="text-[12px] font-bold text-[#b3bdc9]">
                                            {step.number}
                                        </span>

                                        <div>
                                            <h4 className="text-[13px] font-semibold text-[#293746]">
                                                {step.title}
                                            </h4>

                                            <p className="mt-1 text-xs leading-5 text-[#929ca7]">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-9 rounded-xl border border-[#e6edf5] bg-[#f5f8fc] p-4">
                                <div className="flex items-center gap-2 text-[12px] font-semibold text-[#466b96]">
                                    <CircleHelp size={15} />
                                    Your code stays yours
                                </div>

                                <p className="mt-2 text-xs leading-5 text-[#8594a5]">
                                    Importing creates a copy of your
                                    SQL. Your original GitHub file
                                    is not modified.
                                </p>
                            </div>
                        </aside>
                    </div>
                )}

                {/* --------------------------------
                    Screen 2: Repository browser
                -------------------------------- */}

                {demoConnected && !selectedRepo && (
                    <section className="overflow-hidden rounded-2xl border border-[#e9ecf0] bg-white">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#edf0f3] px-7 py-6">
                            <div>
                                <h3 className="text-[17px] font-semibold text-[#202b38]">
                                    Choose a repository
                                </h3>

                                <p className="mt-1 text-xs text-[#929ca7]">
                                    Select where your SQL files are stored.
                                </p>
                            </div>

                            <div className="flex items-center gap-2 rounded-full bg-[#edf8f0] px-3 py-2 text-xs font-medium text-[#44845a]">
                                <CheckCircle2 size={15} />
                                Demo connected
                            </div>
                        </div>

                        <div className="p-7">
                            <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#e5e9ee] bg-[#fafbfc] px-4 py-3">
                                <Search
                                    size={19}
                                    className="text-[#a4acb6]"
                                />

                                <input
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search repositories..."
                                    className="w-full bg-transparent text-[14px] text-[#263445] outline-none placeholder:text-[#abb2bb]"
                                />
                            </div>

                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#9aa3ae]">
                                    Your repositories
                                </span>

                                <span className="text-xs text-[#a0a8b2]">
                                    {filteredRepositories.length} repositories
                                </span>
                            </div>

                            <div className="space-y-3">
                                {filteredRepositories.map((repo) => (
                                    <button
                                        key={repo.id}
                                        type="button"
                                        onClick={() =>
                                            selectRepository(repo)
                                        }
                                        className="group flex w-full items-center gap-4 rounded-xl border border-[#e8ebef] bg-white p-5 text-left transition hover:border-[#a8bfd9] hover:bg-[#f8fbff]"
                                    >
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f1f4f8] text-[#647c98]">
                                            <BookOpen size={22} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h4 className="text-[14px] font-semibold text-[#273849]">
                                                    {repo.name}
                                                </h4>

                                                <span className="rounded-full border border-[#e5e9ee] px-2 py-0.5 text-[10px] text-[#929ba6]">
                                                    {repo.private
                                                        ? "Private"
                                                        : "Public"}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-xs text-[#9aa3ae]">
                                                {repo.owner} · {repo.description}
                                            </p>
                                        </div>

                                        <ChevronRight
                                            size={18}
                                            className="shrink-0 text-[#b1bac5] transition group-hover:translate-x-1 group-hover:text-[#46729f]"
                                        />
                                    </button>
                                ))}

                                {filteredRepositories.length === 0 && (
                                    <div className="py-12 text-center text-sm text-[#9aa3ae]">
                                        No repositories found.
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* --------------------------------
                    Screen 3 & 4: File browser
                -------------------------------- */}

                {demoConnected && selectedRepo && (
                    <div>
                        <button
                            type="button"
                            onClick={goBack}
                            className="mb-5 flex items-center gap-2 text-[13px] font-medium text-[#7d8b9a] transition hover:text-[#385b83]"
                        >
                            <ArrowLeft size={16} />
                            {selectedFile
                                ? "Back to files"
                                : "All repositories"}
                        </button>

                        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                            {/* Repository files */}

                            <section className="overflow-hidden rounded-2xl border border-[#e9ecf0] bg-white">
                                <div className="border-b border-[#edf0f3] p-6">
                                    <div className="flex items-center gap-3">
                                        <FaGithub
                                            size={21}
                                            className="text-[#263445]"
                                        />

                                        <div>
                                            <h3 className="text-[15px] font-semibold text-[#273849]">
                                                {selectedRepo.name}
                                            </h3>

                                            <p className="text-xs text-[#9ba4ae]">
                                                {selectedRepo.owner}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex items-center justify-between rounded-lg border border-[#e8ebef] bg-[#fafbfc] px-3 py-2.5">
                                        <div className="flex items-center gap-2 text-[12px] text-[#60748b]">
                                            <GitBranch size={15} />
                                            main
                                        </div>

                                        <ChevronDown
                                            size={15}
                                            className="text-[#a3acb6]"
                                        />
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="mb-4 flex items-center gap-2 text-xs text-[#9ba4ae]">
                                        <FolderOpen size={15} />
                                        Repository files
                                    </div>

                                    <div className="space-y-2">
                                        {selectedRepo.files.map((file) => {
                                            const active =
                                                selectedFile?.path ===
                                                file.path;

                                            return (
                                                <button
                                                    key={file.path}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedFile(file);
                                                        setMessage("");
                                                    }}
                                                    className={`
                                                        flex w-full items-center gap-3
                                                        rounded-xl border px-3 py-3
                                                        text-left transition
                                                        ${
                                                        active
                                                            ? "border-[#c7daef] bg-[#eff5fc]"
                                                            : "border-transparent hover:bg-[#f6f8fb]"
                                                    }
                                                    `}
                                                >
                                                    <FileCode2
                                                        size={18}
                                                        className={
                                                            active
                                                                ? "text-[#477baa]"
                                                                : "text-[#8e9eaf]"
                                                        }
                                                    />

                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-[13px] font-medium text-[#35475a]">
                                                            {file.name}
                                                        </p>

                                                        <p className="mt-0.5 truncate text-[11px] text-[#a0a9b4]">
                                                            {file.path}
                                                        </p>
                                                    </div>

                                                    {active && (
                                                        <Check
                                                            size={16}
                                                            className="shrink-0 text-[#477baa]"
                                                        />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="border-t border-[#edf0f3] px-6 py-4 text-xs text-[#9aa4ae]">
                                    {selectedRepo.files.length} SQL files
                                    available
                                </div>
                            </section>

                            {/* SQL preview */}

                            <section className="overflow-hidden rounded-2xl border border-[#e9ecf0] bg-white">
                                <div className="flex items-center justify-between border-b border-[#edf0f3] px-6 py-5">
                                    <div>
                                        <h3 className="text-[15px] font-semibold text-[#273849]">
                                            SQL Preview
                                        </h3>

                                        <p className="mt-1 text-xs text-[#9ba4ae]">
                                            Review the query before importing.
                                        </p>
                                    </div>

                                    {selectedFile && (
                                        <span className="rounded-full bg-[#e9f6ef] px-2.5 py-1 text-[11px] font-medium text-[#398657]">
                                            .SQL
                                        </span>
                                    )}
                                </div>

                                {selectedFile ? (
                                    <div>
                                        <div className="flex items-center gap-2 border-b border-[#edf0f3] px-6 py-4">
                                            <FileCode2
                                                size={17}
                                                className="text-[#6e89a8]"
                                            />

                                            <span className="truncate text-[13px] font-medium text-[#44586c]">
                                                {selectedFile.name}
                                            </span>
                                        </div>

                                        <div className="overflow-x-auto bg-[#fafbfc] p-5">
                                            <pre className="min-h-[280px] text-[12px] leading-7 text-[#395471]">
                                                <code>
                                                    {selectedFile.content}
                                                </code>
                                            </pre>
                                        </div>

                                        <div className="border-t border-[#edf0f3] p-6">
                                            <div className="mb-5 flex items-center gap-2 text-xs text-[#83909f]">
                                                <Database size={15} />

                                                Import to your current
                                                Trevor datasource
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setMessage(
                                                        "UI preview only. Connect the SQL editor and Django API to enable importing."
                                                    )
                                                }
                                                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#f4ca53] text-[14px] font-semibold text-[#263445] transition hover:bg-[#eabb38]"
                                            >
                                                <ArrowDownToLine size={18} />

                                                Import to SQL editor

                                                <ArrowRight size={16} />
                                            </button>

                                            {message && (
                                                <div
                                                    role="status"
                                                    className="mt-4 rounded-lg border border-[#dce8f5] bg-[#f3f8fe] px-4 py-3 text-xs leading-5 text-[#4b729d]"
                                                >
                                                    {message}
                                                </div>
                                            )}

                                            <p className="mt-3 text-center text-[11px] text-[#a2aab3]">
                                                Import does not execute your SQL.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex min-h-[440px] flex-col items-center justify-center p-8 text-center">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f0f4f9] text-[#91a4b8]">
                                            <FileCode2 size={29} />
                                        </div>

                                        <h4 className="mt-5 text-[15px] font-semibold text-[#35485b]">
                                            No SQL file selected
                                        </h4>

                                        <p className="mt-2 max-w-[260px] text-[13px] leading-6 text-[#98a3ae]">
                                            Select a file from the repository
                                            to preview its SQL query.
                                        </p>
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                )}

                {/* --------------------------------
                    Bottom information
                -------------------------------- */}

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-[#a0a9b3]">
                        <ShieldCheck size={15} />

                        Your GitHub files are never modified.
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#8a97a5]">
                        Powered by GitHub
                        <ExternalLink size={13} />
                    </div>
                </div>
            </div>
        </main>
    );
}