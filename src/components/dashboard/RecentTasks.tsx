import Link from "next/link";
import { MoveRight, CalendarRange, Dot, Tag, Check, Inbox } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { TaskPriority, TaskStatus } from "@prisma/client";

export default async function RecentTasks() {
    const tasks = await prisma.task.findMany({
        orderBy: {
            createdAt: "desc",
        },
        take: 6,
        select: {
            id: true,
            title: true,
            priority: true,
            status: true,
            category: true,
            dueDate: true,
        },
    });

    const priorityStyles: Record<TaskPriority, string> = {
        LOW: "text-blue-600 bg-blue-100 px-2 py-1 rounded-2xl",
        MEDIUM: "text-orange-500 bg-orange-100 px-2 py-1 rounded-2xl",
        HIGH: "text-red-500 bg-red-100 px-2 py-1 rounded-2xl",
    };

    const formatDate = (date: Date | null) => {
        if (!date) return "No date";
        return new Date(date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
        });
    };

    return (
        <div className="w-[60%] h-137 bg-(--main-bg-color) rounded-xl border border-(--border-color) shadow-lg">
            <div className="flex justify-between py-4 px-5">
                <h2 className="font-extrabold text-lg tracking-wide text-(--main-text-color)">
                    Recent Tasks
                </h2>
                <Link
                    href="/tasks"
                    className="text-(--accent-color) flex gap-1 items-center font-semibold"
                >
                    View all
                    <MoveRight className="w-5 h-5" />
                </Link>
            </div>
            <div>
                <ul className="flex flex-col">
                    {tasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[70%] text-center gap-3 text-gray-500">
                            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                                <Inbox className="w-6 h-6 text-gray-400" />
                            </div>

                            <h3 className="text-lg font-semibold text-gray-500">
                                No recent tasks
                            </h3>

                            <p className="text-sm text-gray-400 max-w-xs">
                                You don’t have any tasks yet. Create your first
                                task to get started.
                            </p>

                            <Link
                                href="/tasks"
                                className="mt-2 px-4 py-2 bg-(--accent-color) text-white rounded-lg text-sm font-extrabold hover:brightness-115 transition"
                            >
                                Create task
                            </Link>
                        </div>
                    ) : (
                        <ul className="flex flex-col">
                            {tasks.map((task) => (
                                <li
                                    key={task.id}
                                    className="w-full flex items-center py-3.5 pl-6 pr-4 border-t border-(--border-color)"
                                >
                                    {task.status === TaskStatus.COMPLETED ? (
                                        <div className="flex items-center justify-center bg-(--accent-color) rounded-full text-white w-5 h-5 mr-5">
                                            <Check className="w-4 h-4" />
                                        </div>
                                    ) : (
                                        <div className="w-5 h-5 mr-5 rounded-full border border-gray-300" />
                                    )}

                                    <div className="flex justify-between items-center w-full">
                                        <div className="flex flex-col">
                                            <h3 className="text-gray-700 font-semibold">
                                                {task.title}
                                            </h3>

                                            <div className="flex items-center gap-1 text-gray-500">
                                                <div className="flex gap-1 items-center">
                                                    <Tag className="w-3.5 h-3.5" />
                                                    <p>{task.category}</p>
                                                </div>

                                                <Dot className="w-4 h-4" />

                                                <div className="flex gap-1 items-center">
                                                    <CalendarRange className="w-3.5 h-3.5" />
                                                    <p>
                                                        {formatDate(
                                                            task.dueDate,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <span
                                            className={`${
                                                priorityStyles[task.priority]
                                            } text-sm tracking-wider`}
                                        >
                                            {task.priority.charAt(0) +
                                                task.priority
                                                    .slice(1)
                                                    .toLowerCase()}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </ul>
            </div>
        </div>
    );
}
