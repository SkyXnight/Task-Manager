import { Inter } from "next/font/google";
import {
    ListTodo,
    Loader,
    CircleCheck,
    CircleAlert,
    TriangleAlert,
    TrendingUp,
} from "lucide-react";
import { getUser } from "@/lib/getUser";
import { prisma } from "@/lib/prisma";

const inter = Inter({ subsets: ["latin"] });

export default async function TaskStats() {
    const user = await getUser();
    if (!user) return null;

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const whereUser = { userId: user.id };

    const [
        totalTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks,
        tasksThisWeek,
        inProgressToday,
    ] = await Promise.all([
        prisma.task.count({ where: whereUser }),

        prisma.task.count({
            where: { ...whereUser, status: "IN_PROGRESS" },
        }),

        prisma.task.count({
            where: { ...whereUser, status: "COMPLETED" },
        }),

        prisma.task.count({
            where: {
                ...whereUser,
                dueDate: { lt: now },
                status: { not: "COMPLETED" },
            },
        }),

        prisma.task.count({
            where: {
                ...whereUser,
                createdAt: { gte: sevenDaysAgo },
            },
        }),

        prisma.task.count({
            where: {
                ...whereUser,
                createdAt: { gte: startOfToday },
            },
        }),

        prisma.task.count({
            where: {
                ...whereUser,
                status: "IN_PROGRESS",
                updatedAt: { gte: startOfToday },
            },
        }),
    ]);

    const completionRate =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <div
            className={`grid grid-cols-4 gap-5 w-full h-40 ${inter.className}`}
        >
            <div className="bg-(--main-bg-color) border border-t-3 border-t-orange-300 border-(--border-color) px-6 pt-5 pb-5 rounded-xl flex flex-col justify-between shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-between items-center">
                    <h1 className="text-gray-500 text-sm font-semibold">
                        TOTAL TASKS
                    </h1>
                    <div className="w-10 h-10 bg-orange-100 text-orange-300 flex items-center justify-center rounded-lg">
                        <ListTodo />
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <span className="font-extrabold text-3xl text-(--main-text-color)">
                        {totalTasks}
                    </span>
                    <span className="flex items-center justify-center gap-1 bg-orange-100 text-orange-400 w-35 text-sm px-2 py-1 rounded-2xl">
                        <TrendingUp className="w-4.5 h-4.5" />+{tasksThisWeek}{" "}
                        this week
                    </span>
                </div>
            </div>
            <div className="bg-(--main-bg-color) border border-t-3 border-t-blue-300 border-(--border-color) px-6 pt-5 pb-5 rounded-xl flex flex-col justify-between shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-between items-center">
                    <h1 className="text-gray-500 text-sm font-semibold">
                        IN PROGRESS
                    </h1>
                    <div className="w-10 h-10 bg-blue-100 text-blue-300 flex items-center justify-center rounded-lg">
                        <Loader />
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <span className="font-extrabold text-3xl text-(--main-text-color)">
                        {inProgressTasks}
                    </span>
                    <span className="flex items-center justify-center gap-1 bg-blue-100 text-blue-500 w-28 text-sm px-2 py-1 rounded-2xl">
                        <TrendingUp className="w-4.5 h-4.5" />+{inProgressToday}{" "}
                        today
                    </span>
                </div>
            </div>
            <div className="bg-(--main-bg-color) border border-t-3 border-t-[#00B49D] border-(--border-color) px-6 pt-5 pb-5 rounded-xl flex flex-col justify-between shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-between items-center">
                    <h1 className="text-gray-500 text-sm font-semibold">
                        COMPLETED
                    </h1>
                    <div className="w-10 h-10 bg-[#d4fcf4] text-[#00B49D] flex items-center justify-center rounded-lg">
                        <CircleCheck />
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <span className="font-extrabold text-3xl text-(--main-text-color)">
                        {completedTasks}
                    </span>
                    <span className="flex items-center justify-center gap-1 bg-[#d4fcf4] text-[#018a78] w-42 text-sm px-2 py-1 rounded-2xl">
                        {completionRate}% completion rate
                    </span>
                </div>
            </div>
            <div className="bg-(--main-bg-color) border border-t-3 border-t-red-300 border-(--border-color) px-6 pt-5 pb-5 rounded-xl flex flex-col justify-between shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1">
                <div className="flex justify-between items-center">
                    <h1 className="text-gray-500 text-sm font-semibold">
                        OVERDUE
                    </h1>
                    <div className="w-10 h-10 bg-red-100 text-red-300 flex items-center justify-center rounded-lg">
                        <CircleAlert />
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <span className="font-extrabold text-3xl text-(--main-text-color)">
                        {overdueTasks}
                    </span>
                    <span className="flex items-center justify-center gap-1 bg-red-100 text-red-400 w-40 text-sm px-2 py-1 rounded-2xl">
                        <TriangleAlert className="w-4.5 h-4.5" />
                        Needs attention
                    </span>
                </div>
            </div>
        </div>
    );
}
