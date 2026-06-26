"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        const res = await fetch("/api/logout", {
            method: "POST",
        });

        if (res.ok) {
            router.push("/login");
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-white text-gray-600 font-semibold ring-1 ring-gray-300 rounded-lg px-4 py-1.5 cursor-pointer hover:bg-gray-100 transition-all duration-300"
        >
            Sign out
        </button>
    );
}
