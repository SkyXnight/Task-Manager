"use client";

import Link from "next/link";
import { CheckSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{
        email?: string[];
        password?: string[];
        general?: string[];
    }>({});

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setErrors(data.errors || {});
                return;
            }

            router.push("/");
            router.refresh();
        } catch {
            setErrors({ general: ["Something went wrong"] });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                <div className="mb-10 flex justify-center">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-[#0B8F7E] flex items-center justify-center shadow-sm">
                            <CheckSquare size={22} className="text-white" />
                        </div>

                        <div>
                            <h1 className="text-xl font-black text-slate-900 leading-none">
                                Task Manager
                            </h1>
                            <p className="text-sm font-semibold text-slate-600 mt-1">
                                Organize everything
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-9 shadow-md">
                    <h2 className="text-2xl font-bold text-slate-900">
                        Welcome back
                    </h2>

                    <p className="mt-1 text-sm font-semibold text-slate-600">
                        Sign in to continue to your workspace
                    </p>

                    <form onSubmit={handleLogin} className="mt-8 space-y-5">
                        <div>
                            <label className="text-sm font-bold text-slate-800">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@company.com"
                                className="mt-2 h-12 w-full rounded-xl border-2 border-gray-200 px-4 text-sm font-semibold text-slate-900  outline-none focus:border-2 focus:border-[#0B8F7E]"
                            />

                            {errors.email?.[0] && (
                                <p className="mt-1 text-sm font-medium text-red-500">
                                    {errors.email[0]}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-bold text-slate-800">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="••••••••"
                                    className="mt-2 h-12 w-full rounded-xl border-2 border-gray-200 px-4 text-sm font-semibold text-slate-900  outline-none focus:border-2 focus:border-[#0B8F7E]"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                    className="absolute cursor-pointer right-3 top-8 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>

                            {errors.password?.[0] && (
                                <p className="mt-1 text-sm font-medium text-red-500">
                                    {errors.password[0]}
                                </p>
                            )}
                        </div>

                        <button
                            disabled={loading}
                            className="h-12 w-full rounded-xl bg-[#0B8F7E] text-lg font-extrabold text-white cursor-pointer shadow-sm hover:bg-[#087C6D] transition active:scale-[0.99]"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="mt-7 text-center text-sm font-semibold text-slate-700">
                        No account?{" "}
                        <Link
                            href="/register"
                            className="text-[#0B8F7E] font-bold underline"
                        >
                            Create one!
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
