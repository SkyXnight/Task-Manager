"use client";

import Link from "next/link";
import { CheckSquare, UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
    const [avatar, setAvatar] = useState<string | null>(null);
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const [errors, setErrors] = useState<{
        name?: string[];
        email?: string[];
        password?: string[];
    }>({});

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatar(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeAvatar = () => {
        setAvatar(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});

        const formData = new FormData();

        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);

        if (fileInputRef.current?.files?.[0]) {
            formData.append("image", fileInputRef.current.files[0]);
        }

        const response = await fetch("/api/register", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const data = await response.json();
            setErrors(data.errors || {});
            return;
        }

        setErrors({});
        setEmail("");
        setName("");
        setPassword("");

        router.push("/");
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
                                Create account
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-9 shadow-md">
                    <div className="mt-2 flex items-center gap-4">
                        <div className="relative">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="h-16 w-16 rounded-full overflow-hidden bg-slate-100 border border-slate-300 cursor-pointer hover:bg-slate-200 transition flex items-center justify-center"
                            >
                                {avatar ? (
                                    <Image
                                        src={avatar}
                                        alt="avatar"
                                        loading="eager"
                                        width={64}
                                        height={64}
                                        className="rounded-full h-full w-full object-cover"
                                    />
                                ) : (
                                    <UploadCloud
                                        size={20}
                                        className="text-slate-500"
                                    />
                                )}
                            </div>

                            {avatar && (
                                <button
                                    onClick={removeAvatar}
                                    type="button"
                                    className="absolute cursor-pointer -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow"
                                >
                                    <X className="w-4.5 h-4.5" />
                                </button>
                            )}
                        </div>

                        <div>
                            <p className="text-sm font-bold text-slate-900">
                                Profile photo
                            </p>
                            <p className="text-xs font-semibold text-slate-600">
                                Click to upload avatar
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                        <div>
                            <label className="text-sm font-bold text-slate-800">
                                Full name
                            </label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                placeholder="John Doe"
                                className="mt-2 h-12 w-full rounded-xl border-2 border-gray-200 px-4 text-[16px] font-semibold text-slate-900 outline-none focus:border-[#0B8F7E]"
                            />

                            {errors.name?.[0] && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.name[0]}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-bold text-slate-800">
                                Email
                            </label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="you@company.com"
                                className="mt-2 h-12 w-full rounded-xl border-2 border-gray-200 px-4 text-[16px] font-semibold text-slate-900 outline-none focus:border-[#0B8F7E]"
                            />

                            {errors.email?.[0] && (
                                <p className="mt-1 text-sm text-red-500">
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
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="mt-2 h-12 w-full rounded-xl border-2 border-gray-200 px-4 text-[16px] font-semibold text-slate-900 outline-none focus:border-[#0B8F7E]"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                    className="absolute right-3 top-8 cursor-pointer -translate-y-1/2 text-slate-500 hover:text-slate-700"
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>

                            {errors.password?.[0] && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.password[0]}
                                </p>
                            )}
                        </div>

                        <button className="h-12 w-full rounded-xl bg-[#0B8F7E] text-lg font-extrabold text-white shadow-sm hover:bg-[#087C6D] transition active:scale-[0.99]">
                            Create account
                        </button>
                    </form>

                    <p className="mt-7 text-center text-sm font-semibold text-slate-700">
                        Already have account?{" "}
                        <Link
                            href="/login"
                            className="text-[#0B8F7E] font-bold underline"
                        >
                            Sign in!
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
