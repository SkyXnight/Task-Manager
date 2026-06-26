"use client";

import Link from "next/link";
import {
    LayoutDashboard,
    ClipboardList,
    CalendarRange,
    Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Logo from "../../public/logo.svg";

export default function Sidebar() {
    const pathname = usePathname();

    const activeClass =
        "font-semibold text-[16px] tracking-wide text-(--accent-color) bg-(--accent-bg-color) border-r-2 border-(--accent-color)";

    const inactiveClass =
        "font-semibold text-[16px] tracking-wide text-(--text-color) border-r-2 border-transparent hover:bg-(--menu-item-hover-bg-color) hover:border-(--menu-item-border-color)";

    return (
        <nav className="bg-(--main-bg-color) border-r-2 border-(--border-color) h-full w-70">
            <div className="w-full flex flex-col items-center py-6.5 border-b border-(--border-color)">
                <h1 className="text-(--accent-color) text-2xl font-bold flex items-center gap-1">
                    <Logo className="text-(--accent-color) w-7.5 h-7.5" />
                    Task Manager
                </h1>
                <span className="text-gray-500 font-semibold">
                    Task Management System
                </span>
            </div>
            <div className="flex flex-col p-3 gap-4">
                <Link
                    href="/"
                    className={`flex gap-2.5 pl-4 py-3 rounded-md transition-all duration-300 ${
                        pathname === "/" ? activeClass : inactiveClass
                    }`}
                >
                    <LayoutDashboard />
                    <span>Dashboard</span>
                </Link>
                <Link
                    href="/tasks"
                    className={`flex gap-2.5 pl-4 py-3 rounded-md transition-all duration-300 ${
                        pathname === "/tasks" ? activeClass : inactiveClass
                    }`}
                >
                    <ClipboardList />
                    <span>Tasks</span>
                </Link>
                <Link
                    href="/calendar"
                    className={`flex gap-2.5 pl-4 py-3 rounded-md transition-all duration-300 ${
                        pathname === "/calendar" ? activeClass : inactiveClass
                    }`}
                >
                    <CalendarRange />
                    <span>Calendar</span>
                </Link>
                <Link
                    href="/settings"
                    className={`flex gap-2.5 pl-4 py-3 rounded-md transition-all duration-300 ${
                        pathname === "/settings" ? activeClass : inactiveClass
                    }`}
                >
                    <Settings />
                    <span>Settings</span>
                </Link>
            </div>
        </nav>
    );
}
