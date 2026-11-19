"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";
import {
    BadgeCheck,
    Database,
    ExternalLink,
    MessageCircle,
    Rocket,
    Settings,
} from "lucide-react";
import Link from "next/link";
const cards = [
    { text: "", color: "#8BCB91" },
    { text: "", color: "#FA775C" },
    { text: "", color: "#FFC83D" },
    { text: "", color: "#8BCDD1" },

    { text: "Start from", color: "#FFFFFF" },
    { text: "customers", color: "#FFC83D" },

    { text: "Join", color: "#FFFFFF" },
    { text: "Top products", color: "#B9A3E8", external: true },

    { text: "", color: "#FFC83D" },
    { text: "created_at Today", color: "#82CDD0" },

    { text: "Filter", color: "#FFFFFF" },
    { text: "", color: "#FA775C" },
];

export default function HomePage() {
    const router = useRouter();

    const {
        isAuthenticated,
        isLoading,
    } = useAuth();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace("/datasources");
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return null;
    }

    if (isAuthenticated) {
        return null;
    }
    return (
        <main className="relative min-h-screen overflow-hidden bg-white text-[#353542]">
            {/* HEADER */}
            <header className="absolute left-0 top-0 z-30 flex h-[80px] w-full items-center justify-between px-9">
                <div className="flex items-center gap-12">
                    {/* Logo */}
                    <Link href="/">
                        <div className="flex items-center text-[22px] font-black tracking-[1px]">
            <span className="relative mr-[2px] inline-block">
              <span className="text-[#ffc83d]">T</span>
            </span>
                            <span>REVOR</span>
                        </div>
                    </Link>
                    {/* Navigation */}
                    <nav className="hidden items-center gap-10 text-[16px] font-medium lg:flex">
                        <a className="transition hover:opacity-60" href="#">
                            Self-service analytics
                        </a>

                        <a className="transition hover:opacity-60" href="#">
                            Embedded dashboards
                        </a>

                        <a className="transition hover:opacity-60" href="#">
                            Pricing
                        </a>

                        <a className="transition hover:opacity-60" href="#">
                            Customers
                        </a>
                    </nav>
                </div>

                {/* Header buttons */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/login/sign-in"
                        className="rounded-full border-2 border-[#325f8f] bg-white px-5 py-2.5 text-[14px] font-semibold text-[#325f8f] transition hover:bg-gray-50"
                    >
                        Login
                    </Link>

                    <Link
                        href="/login/sign-up"
                        className="rounded-full bg-[#ffc83d] px-5 py-3 text-[14px] font-semibold text-[#325f8f] transition hover:brightness-95"
                    >
                        Try it for free
                    </Link>
                </div>
            </header>

            {/* MAIN */}
            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
                {/* LEFT SIDE */}
                <section className="relative flex min-h-screen items-center">
                    <div className="w-full px-8 pb-28 pt-32 sm:px-16 lg:pl-[10.5vw] lg:pr-10">
                        <div className="max-w-[560px]">
                            <h1 className="text-[43px] font-bold leading-[1.05] tracking-[-1.5px] sm:text-[50px]">
                                There&apos;s a better way
                                <br />
                                to work with data.
                            </h1>

                            <p className="mt-6 max-w-[530px] text-[17px] leading-7 text-[#48485a]">
                                Trevor empowers your whole team to get answers from
                                <br className="hidden sm:block" />
                                your database, even if they don&apos;t know SQL.
                            </p>

                            {/* Pills */}
                            <div className="mt-8 flex flex-wrap gap-2">
                                <div className="flex items-center gap-2 rounded-full bg-[#f6f6f6] px-3 py-1.5 text-[12px] text-[#5d5d68]">
                                    <Rocket size={14} className="text-[#9869e8]" />
                                    5 minute set up
                                </div>

                                <div className="flex items-center gap-2 rounded-full bg-[#f6f6f6] px-3 py-1.5 text-[12px] text-[#5d5d68]">
                                    <Database size={14} className="text-[#45aeb5]" />
                                    No credit card needed
                                </div>

                                <div className="flex items-center gap-2 rounded-full bg-[#f6f6f6] px-3 py-1.5 text-[12px] text-[#5d5d68]">
                                    <BadgeCheck size={14} className="text-[#fa775c]" />
                                    5-star support
                                </div>
                            </div>

                            {/* CTA */}
                            <button className="mt-8 rounded-full bg-[#ffc83d] px-7 py-4 text-[16px] font-bold text-[#325f8f] transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                                Try it for free
                            </button>
                        </div>
                    </div>

                    {/* Companies */}
                    <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-center lg:block">
                        <p className="mb-4 whitespace-nowrap text-[12px] text-[#666675]">
                            Used by great companies all over the world
                        </p>

                        <div className="flex items-center gap-6 whitespace-nowrap text-[16px] font-bold text-[#555563]">
                            <span>◔ goodtime</span>
                            <span>◢ influencer</span>
                            <span>♥ scalapay</span>
                            <span className="text-[20px]">carwow</span>
                        </div>
                    </div>
                </section>

                {/* RIGHT SIDE */}
                <section className="relative hidden min-h-screen overflow-hidden bg-[#f5f5f4] lg:block">
                    {/* Rotated data cards */}
                    <div className="absolute -left-[70px] -top-[135px] h-[1250px] w-[980px] rotate-[-16deg]">
                        <div className="grid grid-cols-3 gap-5">
                            {cards.map((card, index) => {
                                const wide =
                                    index === 4 ||
                                    index === 5 ||
                                    index === 7 ||
                                    index === 9;

                                return (
                                    <div
                                        key={index}
                                        style={{ backgroundColor: card.color }}
                                        className={`
                      flex h-[170px] items-center justify-center
                      rounded-[22px]
                      border-[10px] border-[#f5f5f4]
                      px-6
                      ${
                                            wide
                                                ? "col-span-2"
                                                : "col-span-1"
                                        }
                    `}
                                    >
                                        {card.text && (
                                            <span className="flex items-center gap-4 whitespace-nowrap text-[38px] font-medium text-[#34343f]">
                        {card.text}

                                                {card.external && (
                                                    <ExternalLink
                                                        size={38}
                                                        strokeWidth={2}
                                                    />
                                                )}
                      </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* More decorative blocks */}
                        <div className="mt-5 grid grid-cols-3 gap-5">
                            <div className="h-[175px] rounded-[22px] border-[10px] border-[#f5f5f4] bg-[#B9A3E8]" />
                            <div className="h-[175px] rounded-[22px] border-[10px] border-[#f5f5f4] bg-[#8BCB91]" />
                            <div className="h-[175px] rounded-[22px] border-[10px] border-[#f5f5f4] bg-[#FFC83D]" />
                        </div>
                    </div>
                </section>
            </div>

            {/* Settings button */}
            <button
                aria-label="Settings"
                className="fixed bottom-8 left-8 z-40 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#34343f] bg-white"
            >
                <Settings size={21} />
            </button>

            {/* Chat */}
            <button
                aria-label="Chat"
                className="fixed bottom-7 right-7 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#275c91] text-white shadow-lg"
            >
                <MessageCircle size={23} fill="white" />
            </button>
        </main>
    );
}