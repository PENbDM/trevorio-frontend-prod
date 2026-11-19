"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { DatasourceConnectFlow } from "@/features/datasource-connect";
import {
    useDatasources,
    useDeleteDatasource,
    type Datasource,
} from "@/entities/datasource";
import { useMe } from "@/features/auth";
import Link from "next/link";

export default function DatasourceListPage() {
    const router = useRouter();

    const [isConnecting, setIsConnecting] = useState(false);

    const {
        data: datasources,
        isLoading,
        isError,
    } = useDatasources();

    const {
        data: user,
    } = useMe();


    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        router.push("/login/sign-in");
    };


    return (
        <main className="min-h-dvh bg-[#fafafa] text-[#41414f]">

            {/* HEADER */}
            <header className="flex h-[72px] w-full items-center justify-between px-6">

                <Link href="/">
                    <div className="text-[25px] font-black tracking-[0.5px] text-[#444450]">
                    <span className="text-[#ffc438]">
                        T
                    </span>
                        REVOR
                    </div>
                </Link>


                <button
                    type="button"
                    onClick={handleLogout}
                    className="
                        rounded-full
                        border border-[#e4e4e8]
                        bg-white
                        px-4
                        py-2
                        text-[13px]
                        text-[#58708d]
                        transition
                        hover:bg-[#f4f4f6]
                    "
                >
                    Logout
                </button>

            </header>


            {/* LOADING */}
            {isLoading && (
                <div className="flex min-h-[70vh] items-center justify-center">
                    <p className="text-[15px] text-[#777784]">
                        Loading datasources...
                    </p>
                </div>
            )}


            {/* ERROR */}
            {isError && (
                <div className="flex min-h-[70vh] items-center justify-center">
                    <p className="text-[15px] text-red-500">
                        Failed to load datasources.
                    </p>
                </div>
            )}


            {/* CONTENT */}
            {!isLoading && !isError && (
                <>
                    {isConnecting ? (

                        <ConnectScreen
                            onClose={() =>
                                setIsConnecting(false)
                            }
                        />

                    ) : datasources && datasources.length > 0 ? (

                        <ConnectedDatasourceScreen
                            datasources={datasources}
                            email={user?.email ?? ""}
                            onConnect={() =>
                                setIsConnecting(true)
                            }
                        />

                    ) : (

                        <WelcomeScreen
                            onConnect={() =>
                                setIsConnecting(true)
                            }
                        />

                    )}
                </>
            )}


            {/* FLOATING CHAT */}
            <button
                type="button"
                aria-label="Open chat"
                className="
                    fixed
                    bottom-5
                    right-5
                    flex
                    h-[46px]
                    w-[46px]
                    items-center
                    justify-center
                    rounded-full
                    bg-[#356991]
                    text-white
                    shadow-lg
                    transition
                    hover:bg-[#2c5c82]
                "
            >
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                </svg>
            </button>

        </main>
    );
}


/* =========================================================
   CONNECTED DATASOURCES
========================================================= */

function ConnectedDatasourceScreen({
                                       datasources,
                                       email,
                                       onConnect,
                                   }: {
    datasources: Datasource[];
    email: string;
    onConnect: () => void;
}) {
    return (
        <section
            className="
                mx-auto
                flex
                w-full
                max-w-[1120px]
                flex-col
                items-center
                px-6
                pt-[45px]
            "
        >

            {/* WELCOME */}
            <WelcomeTitle />


            {/* EMAIL + COUNT */}
            <p
                className="
                    mt-[45px]
                    text-center
                    text-[22px]
                    tracking-[0.1px]
                    text-[#50505d]
                "
            >
                Datasources for{" "}

                <span className="font-semibold">
                    {email || "your account"}
                </span>

                {" "}
                ({datasources.length})
            </p>


            {/* DATASOURCE ROWS */}
            <div className="mt-6 w-full max-w-[920px] space-y-3">

                {datasources.map((datasource) => (
                    <DatasourceRow
                        key={datasource.id}
                        datasource={datasource}
                    />
                ))}

            </div>


            {/* CONNECT BUTTON */}
            <button
                type="button"
                onClick={onConnect}
                className="
                    mt-[68px]
                    flex
                    h-[58px]
                    items-center
                    gap-4
                    rounded-full
                    bg-[#ffc438]
                    px-8
                    text-[20px]
                    font-medium
                    text-[#35658d]
                    transition
                    hover:bg-[#f5b92d]
                "
            >
                <PlusIcon />

                Connect a database
            </button>


            <HelpSection />

        </section>
    );
}


/* =========================================================
   DATASOURCE ROW
========================================================= */

function DatasourceRow({
                           datasource,
                       }: {
    datasource: Datasource;
}) {
    const router = useRouter();

    const deleteMutation = useDeleteDatasource();

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);


    const launchDatasource = () => {
        router.push(
            `/datasources/${datasource.id}`
        );
    };


    const handleDelete = () => {
        deleteMutation.mutate(
            datasource.id,
            {
                onSuccess: () => {
                    setShowDeleteModal(false);
                },

                onError: () => {
                    alert(
                        "Failed to delete datasource."
                    );
                },
            }
        );
    };


    return (
        <>
            {/* DATASOURCE ROW */}
            <div
                onClick={launchDatasource}
                className="
                    group
                    min-h-[112px]
                    w-full
                    cursor-pointer
                    rounded-[10px]
                    border
                    border-[#d9dce2]
                    bg-white
                    px-5
                    py-4
                    transition
                    hover:border-[#c6cad2]
                    hover:shadow-[0_3px_10px_rgba(0,0,0,0.05)]
                "
            >

                <div className="flex h-full items-center justify-between">

                    {/* LEFT */}
                    <div>

                        <div className="flex items-center gap-3">

                            <h2
                                className="
                                    text-[18px]
                                    font-normal
                                    text-[#585963]
                                "
                            >
                                {datasource.name}
                            </h2>


                            {/* DELETE */}
                            <button
                                type="button"
                                aria-label="Delete datasource"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setShowDeleteModal(true);
                                }}
                                className="
                                    flex
                                    h-[36px]
                                    w-[36px]
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-[#dfe2e7]
                                    bg-white
                                    text-[#496c93]
                                    transition
                                    hover:border-red-200
                                    hover:bg-red-50
                                    hover:text-red-500
                                "
                            >
                                <span className="mb-[6px] text-[20px] tracking-[1px]">
                                    ...
                                </span>
                            </button>

                        </div>


                        {/* BADGES */}
                        <div className="mt-4 flex items-center gap-2">

                            <div
                                className="
                                    flex
                                    h-[30px]
                                    min-w-[42px]
                                    items-center
                                    justify-center
                                    rounded-[5px]
                                    bg-[#e7eef8]
                                    px-2
                                "
                            >
                                <PostgresIcon />
                            </div>


                            <span
                                className="
                                    rounded-[5px]
                                    bg-[#e7eef8]
                                    px-3
                                    py-[6px]
                                    text-[13px]
                                    leading-none
                                    text-[#46698e]
                                "
                            >
                                owner
                            </span>

                        </div>

                    </div>


                    {/* RIGHT */}
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            text-[15px]
                            text-[#41688e]
                        "
                    >
                        <span>
                            Click to launch
                        </span>

                        <span
                            className="
                                text-[24px]
                                font-light
                                transition-transform
                                group-hover:translate-x-[3px]
                            "
                        >
                            ›
                        </span>
                    </div>

                </div>

            </div>


            {/* DELETE MODAL */}
            {showDeleteModal && (
                <div
                    className="
                        fixed
                        inset-0
                        z-[100]
                        flex
                        items-center
                        justify-center
                        bg-black/30
                        px-4
                        backdrop-blur-[2px]
                    "
                    onClick={() => {
                        if (!deleteMutation.isPending) {
                            setShowDeleteModal(false);
                        }
                    }}
                >

                    <div
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                        className="
                            w-full
                            max-w-[430px]
                            rounded-[18px]
                            border
                            border-[#e4e4e8]
                            bg-white
                            p-7
                            shadow-[0_20px_60px_rgba(0,0,0,0.15)]
                        "
                    >

                        {/* ICON */}
                        <div
                            className="
                                flex
                                h-[48px]
                                w-[48px]
                                items-center
                                justify-center
                                rounded-full
                                bg-red-50
                                text-red-500
                            "
                        >
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M3 6h18" />

                                <path d="M8 6V4h8v2" />

                                <path d="M19 6l-1 14H6L5 6" />

                                <path d="M10 11v5" />

                                <path d="M14 11v5" />
                            </svg>
                        </div>


                        {/* TITLE */}
                        <h2
                            className="
                                mt-5
                                text-[21px]
                                font-semibold
                                text-[#3f3f4d]
                            "
                        >
                            Delete datasource?
                        </h2>


                        {/* DESCRIPTION */}
                        <p
                            className="
                                mt-2
                                text-[14px]
                                leading-6
                                text-[#777784]
                            "
                        >
                            Are you sure you want to delete{" "}

                            <span className="font-semibold text-[#4c4c58]">
                                {datasource.name}
                            </span>

                            ? This will remove the datasource
                            connection from Trevor.
                        </p>


                        {/* ACTIONS */}
                        <div className="mt-7 flex justify-end gap-3">

                            <button
                                type="button"
                                disabled={deleteMutation.isPending}
                                onClick={() =>
                                    setShowDeleteModal(false)
                                }
                                className="
                                    rounded-full
                                    border
                                    border-[#dddfe4]
                                    bg-white
                                    px-5
                                    py-2.5
                                    text-[14px]
                                    font-medium
                                    text-[#555764]
                                    transition
                                    hover:bg-[#f5f5f7]
                                    disabled:opacity-50
                                "
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                disabled={deleteMutation.isPending}
                                onClick={handleDelete}
                                className="
                                    flex
                                    min-w-[100px]
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-red-500
                                    px-5
                                    py-2.5
                                    text-[14px]
                                    font-medium
                                    text-white
                                    transition
                                    hover:bg-red-600
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >
                                {deleteMutation.isPending ? (
                                    <span
                                        className="
                                            h-[17px]
                                            w-[17px]
                                            animate-spin
                                            rounded-full
                                            border-2
                                            border-white/40
                                            border-t-white
                                        "
                                    />
                                ) : (
                                    "Delete"
                                )}
                            </button>

                        </div>

                    </div>

                </div>
            )}
        </>
    );
}


/* =========================================================
   ZERO DATASOURCES
========================================================= */

function WelcomeScreen({
                           onConnect,
                       }: {
    onConnect: () => void;
}) {
    return (
        <section
            className="
                mx-auto
                flex
                w-full
                max-w-[900px]
                flex-col
                items-center
                px-5
                pt-[65px]
            "
        >

            <WelcomeTitle />


            <p
                className="
                    mt-6
                    text-center
                    text-[18px]
                    tracking-[0.2px]
                    text-[#555563]
                "
            >
                To get started, connect your database or try a sample database.
            </p>


            <button
                type="button"
                onClick={onConnect}
                className="
                    mt-8
                    flex
                    h-[52px]
                    items-center
                    gap-3
                    rounded-full
                    bg-[#ffc438]
                    px-6
                    text-[17px]
                    font-medium
                    text-[#35658d]
                    transition
                    hover:bg-[#f5b92d]
                "
            >
                <PlusIcon />

                Connect a database
            </button>


            <HelpSection />


            {/* TESTIMONIALS */}
            <div
                className="
                    mt-10
                    grid
                    w-full
                    max-w-[760px]
                    grid-cols-1
                    gap-7
                    md:grid-cols-3
                "
            >

                <Testimonial
                    initials="S"
                    name="Steph"
                    role={
                        <>
                            Chief of Staff @
                            <br />
                            Kindred
                        </>
                    }
                >
                    It&apos;s the first tool I&apos;ve seen that can help my
                    non-technical peers jump into data!
                </Testimonial>


                <Testimonial
                    initials="B"
                    name="Brad"
                    role={
                        <>
                            Customer Success
                            <br />
                            @ Curemint
                        </>
                    }
                >
                    We freaking love this tool, it has changed the game for us!
                </Testimonial>


                <Testimonial
                    initials="S"
                    name="Sarah"
                    role={
                        <>
                            Ops @ Roofr
                        </>
                    }
                >
                    We love the platform&apos;s plug and play method for
                    creating reports and pulling data... A breeze!
                </Testimonial>

            </div>

        </section>
    );
}


/* =========================================================
   CONNECT SCREEN
========================================================= */

function ConnectScreen({
                           onClose,
                       }: {
    onClose: () => void;
}) {
    return (
        <section
            className="
                mx-auto
                flex
                w-full
                max-w-[900px]
                flex-col
                items-center
                px-5
                pt-[45px]
            "
        >

            <WelcomeTitle />


            <div className="mt-10 w-full">
                <DatasourceConnectFlow
                    onClose={onClose}
                />
            </div>


            <HelpSection />

        </section>
    );
}


/* =========================================================
   WELCOME TITLE
========================================================= */

function WelcomeTitle() {
    return (
        <div className="flex items-center gap-2">

            <WelcomeHandIcon />

            <h1
                className="
                    text-[46px]
                    font-semibold
                    tracking-[-1.5px]
                    text-[#3f3f4d]
                "
            >
                Welcome
            </h1>

        </div>
    );
}


/* =========================================================
   HELP
========================================================= */

function HelpSection() {
    return (
        <div
            className="
                mt-[105px]
                flex
                items-center
                gap-2
                pb-10
                text-[14px]
                text-[#555563]
            "
        >
            <span>
                Need help with anything?
            </span>

            <button
                type="button"
                className="
                    flex
                    items-center
                    gap-1
                    text-[#456b92]
                    underline
                "
            >
                Chat with us

                <ChatIcon />
            </button>
        </div>
    );
}


/* =========================================================
   TESTIMONIAL
========================================================= */

function Testimonial({
                         initials,
                         name,
                         role,
                         children,
                     }: {
    initials: string;
    name: string;
    role: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div
            className="
                min-h-[145px]
                rounded-[14px]
                border
                border-[#e0e0e3]
                bg-white
                p-4
                shadow-[0_2px_5px_rgba(0,0,0,0.08)]
            "
        >

            <div className="flex items-start gap-3">

                <div
                    className="
                        flex
                        h-[42px]
                        w-[42px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#d9e7f4]
                        text-[15px]
                        font-semibold
                        text-[#476b8c]
                    "
                >
                    {initials}
                </div>


                <div>

                    <h3 className="text-[18px] font-semibold leading-5 text-[#41414f]">
                        {name}
                    </h3>

                    <div className="mt-1 text-[13px] leading-[15px] text-[#41414f]">
                        {role}
                    </div>

                </div>

            </div>


            <p className="mt-4 text-[13px] leading-[17px] text-[#555563]">
                {children}
            </p>

        </div>
    );
}


/* =========================================================
   ICONS
========================================================= */

function PlusIcon() {
    return (
        <span className="relative block h-[24px] w-[24px] shrink-0">

            <span
                className="
                    absolute
                    left-1/2
                    top-0
                    h-full
                    w-[2px]
                    -translate-x-1/2
                    bg-[#35658d]
                "
            />

            <span
                className="
                    absolute
                    left-0
                    top-1/2
                    h-[2px]
                    w-full
                    -translate-y-1/2
                    bg-[#35658d]
                "
            />

        </span>
    );
}


function WelcomeHandIcon() {
    return (
        <svg
            width="45"
            height="45"
            viewBox="0 0 40 40"
            fill="none"
            className="text-[#93b2df]"
        >
            <path
                d="M15 20V8.5C15 6.6 16.5 5 18.5 5C20.4 5 22 6.6 22 8.5V18"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />

            <path
                d="M22 17V6.5C22 4.6 23.5 3 25.5 3C27.4 3 29 4.6 29 6.5V19"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />

            <path
                d="M29 18V10C29 8.1 30.5 6.5 32.5 6.5C34.4 6.5 36 8.1 36 10V22C36 30.3 30.5 36 22.5 36C17.5 36 13.6 33.9 10.8 30.6L5 23.8C3.7 22.2 3.9 19.9 5.5 18.6C7 17.4 9.1 17.5 10.5 18.8L15 23"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}


function PostgresIcon() {
    return (
        <svg
            width="23"
            height="23"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4f789c"
            strokeWidth="1.8"
        >
            <ellipse
                cx="12"
                cy="5"
                rx="7"
                ry="3"
            />

            <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />

            <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
        </svg>
    );
}


function ChatIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <circle
                cx="12"
                cy="12"
                r="9"
            />

            <path d="M8 10h8" />
            <path d="M8 14h5" />
        </svg>
    );
}