import { CalendarDays, MoveRight, Tag, Inbox } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { TaskPriority } from "@/generated/prisma/client";
import Link from "next/link";

export default async function TodayTasks() {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const tasks = await prisma.task.findMany({
        where: {
            dueDate: {
                gte: startOfToday,
                lte: endOfToday,
            },
        },
        orderBy: {
            dueDate: "asc",
        },
        select: {
            id: true,
            title: true,
            category: true,
            priority: true,
        },
    });

    const priorityStyles: Record<TaskPriority, string> = {
        LOW: "bg-blue-100 text-blue-600",
        MEDIUM: "bg-orange-100 text-orange-600",
        HIGH: "bg-red-100 text-red-600",
    };

    return (
        <div className="w-full h-80 bg-(--main-bg-color) p-6 shadow-lg border border-(--border-color) rounded-xl flex flex-col">
            <div className="flex flex-col gap-3">
                <div className="flex gap-2 items-center">
                    <CalendarDays className="w-6 h-6 text-(--accent-color)" />
                    <h2 className="text-lg font-extrabold text-(--main-text-color)">
                        Today&apos;s Tasks
                    </h2>
                </div>

                <div className="flex gap-3.5 items-center">
                    <h1 className="text-4xl font-bold text-(--accent-color)">
                        {tasks.length}
                    </h1>

                    <span className="font-bold text-gray-500 text-lg tracking-wide">
                        Tasks due today
                    </span>
                </div>
            </div>

            <hr className="h-0.5 bg-(--border-color) border-0 my-4" />

            <div className="flex flex-col gap-3 flex-1 justify-start overflow-y-scroll">
                {tasks.length === 0 ? (
                    <div className="flex flex-col items-center pt-4 h-full text-gray-500 gap-2">
                        <Inbox className="w-8 h-8 text-gray-400" />
                        <p className="font-semibold">No tasks for today</p>
                        <span className="text-sm text-gray-400">
                            Your schedule looks clear 🎉
                        </span>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            className="flex justify-between items-center"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-(--accent-color)" />

                                <div className="flex flex-col">
                                    <h4 className="font-semibold text-gray-800">
                                        {task.title}
                                    </h4>

                                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                                        <Tag className="w-3.5 h-3.5" />
                                        <span>{task.category}</span>
                                    </div>
                                </div>
                            </div>

                            <span
                                className={`px-3 py-1 rounded-full text-sm ${
                                    priorityStyles[task.priority]
                                }`}
                            >
                                {task.priority}
                            </span>
                        </div>
                    ))
                )}
            </div>

            <div className="flex flex-col justify-center relative">
                <hr className="h-0.5 bg-(--border-color) border-0 mb-2" />

                <Link
                    href="/tasks"
                    className="absolute -bottom-5 flex text-(--accent-color) items-center gap-2 font-semibold hover:gap-3 transition-all"
                >
                    <span>View all today&apos;s tasks</span>
                    <MoveRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
