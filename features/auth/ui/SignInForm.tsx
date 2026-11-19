"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "../model/useAuth";
import Link from "next/link";



export default function SignInForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginMutation = useLogin();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        loginMutation.mutate(
            {
                email,
                password,
            },
            {
                onSuccess: () => {
                    router.push("/");
                },
            }
        );
    };
    return (
        <main className="flex min-h-dvh w-full items-center justify-center bg-[#f8f8fa] px-4">
            <div className="w-full max-w-[310px]">
                {/* Logo */}
                <Link href="/" className="mb-6 flex justify-center">
                    <div className="text-[40px] font-black tracking-[1px] text-[#3f3f4d]">
                        <span className="text-[#ffc638]">T</span>
                        REVOR
                    </div>
                </Link>

                {/* Title */}
                <h1 className="mb-5 text-center text-[30px] font-medium text-[#3f3f4d]">
                    Log in
                </h1>

                {/* Google */}
                <button
                    type="button"
                    className="relative flex h-[58px] w-full items-center justify-center rounded-full bg-[#3296df] text-[16px] font-medium text-white transition hover:bg-[#2588cf]"
                >
          <span className="absolute left-[5px] flex h-[48px] w-[48px] items-center justify-center rounded-full bg-white">
            <svg
                width="27"
                height="27"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
              <path
                  fill="#4285F4"
                  d="M21.35 12.18c0-.69-.06-1.2-.19-1.73H12v3.33h5.38c-.11.83-.69 2.08-1.99 2.92l-.02.11 2.89 2.18.2.02c1.84-1.66 2.89-4.1 2.89-6.83Z"
              />
              <path
                  fill="#34A853"
                  d="M12 21.5c2.63 0 4.83-.84 6.44-2.49l-3.07-2.31c-.82.54-1.93.92-3.37.92-2.57 0-4.75-1.7-5.53-4.05l-.11.01-3 2.27-.04.1C4.92 19.18 8.21 21.5 12 21.5Z"
              />
              <path
                  fill="#FBBC05"
                  d="M6.47 13.57A5.67 5.67 0 0 1 6.15 12c0-.55.11-1.08.3-1.57v-.12L3.4 8l-.1.05A9.25 9.25 0 0 0 2.5 12c0 1.42.34 2.76.82 3.95l3.15-2.38Z"
              />
              <path
                  fill="#EA4335"
                  d="M12 6.38c1.82 0 3.04.77 3.74 1.4l2.76-2.63C16.81 3.61 14.63 2.5 12 2.5c-3.79 0-7.08 2.32-8.68 5.55l3.13 2.38C7.24 8.08 9.43 6.38 12 6.38Z"
              />
            </svg>
          </span>

                    Sign in with Google
                </button>

                {/* Heroku */}
                <button
                    type="button"
                    className="mt-3 flex h-[58px] w-full items-center justify-center gap-3 rounded-full bg-[#7c58a3] text-[16px] font-medium text-white transition hover:bg-[#704d98]"
                >
          <span className="flex h-4 w-4 items-center justify-center rounded-[2px] border border-white/70 text-[10px]">
            H
          </span>

                    Connect via Heroku
                </button>

                {/* Divider */}
                <div className="my-5 h-px w-full bg-[#e6e6e8]" />

                {/* Form */}
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        autoComplete="email"
                        required
                        className="
            h-[48px]
            w-full
            rounded-[4px]
            border
            border-[#d8d8dc]
            bg-white
            px-4
            text-[14px]
            text-[#3f3f4d]
            outline-none
            transition
            placeholder:text-[#9a9aa3]
            focus:border-[#6b8cab]
        "
                    />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        autoComplete="current-password"
                        required
                        className="
            h-[48px]
            w-full
            rounded-[4px]
            border
            border-[#d8d8dc]
            bg-white
            px-4
            text-[14px]
            text-[#3f3f4d]
            outline-none
            transition
            placeholder:text-[#9a9aa3]
            focus:border-[#6b8cab]
        "
                    />

                    {loginMutation.isError && (
                        <p className="text-center text-[13px] text-red-500">
                            Invalid email or password
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="
            flex
            h-[48px]
            w-full
            items-center
            justify-center
            rounded-[4px]
            bg-[#45678f]
            text-[14px]
            font-medium
            text-white
            transition
            hover:bg-[#3d5d81]
            disabled:cursor-not-allowed
            disabled:opacity-60
        "
                    >
                        {loginMutation.isPending
                            ? "Signing in..."
                            : "Sign in"}
                    </button>
                </form>
                {loginMutation.isError && (
                    <p className="text-sm text-red-500">
                        Invalid email or password
                    </p>
                )}
                <div className="mt-5 text-center">
                    <Link
                        href="/login/forgot-password"
                        className="text-[13px] text-[#45678f] underline"
                    >
                        Forgotten my password
                    </Link>

                    <p className="mt-6 text-[13px] text-[#474755]">
                        Don&apos;t yet have an account?{" "}
                        <Link
                            href="/login/sign-up"
                            className="text-[#45678f] underline"
                        >
                            Sign up
                        </Link>
                        .
                    </p>

                    <p className="mt-7 text-[11px] text-[#9b9ba5]">
                        © Trevor Analytics, 2026
                    </p>
                </div>
            </div>

            {/* Chat */}
            <button
                type="button"
                className="fixed bottom-5 right-5 flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#356991] text-white shadow-lg"
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