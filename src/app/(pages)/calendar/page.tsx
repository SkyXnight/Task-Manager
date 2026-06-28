import { Pencil } from "lucide-react";
import { CalendarView } from "@/components/calendar/CalendarView";
import { prisma } from "@/lib/prisma";
import type { TaskClient } from "@/types/task";

export default async function CalendarPage() {
    const tasks = await prisma.task.findMany({});

    const serializedTasks: TaskClient[] = tasks.map((t) => ({
        ...t,
        dueDate: t.dueDate ? t.dueDate.toISOString().split("T")[0] : null,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
    }));

    return (
        <div className="bg-(--bg-color) w-full min-h-screen flex flex-col px-15 pt-3 pb-10">
            <div className="w-full flex justify-between items-center h-20">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-extrabold text-(--main-text-color)">
                        Calendar
                    </h1>
                    <span className="text-gray-500 tracking-wide">
                        View and track your deadlines visually
                    </span>
                </div>

                <button className="flex items-center gap-2 bg-(--accent-color) h-10 px-4 rounded-lg text-[17px] tracking-wide text-white font-semibold cursor-pointer hover:brightness-115 transition-all duration-200">
                    <Pencil className="w-5.5 h-5.5" />
                    Add Task
                </button>
            </div>

            <CalendarView tasks={serializedTasks} />
        </div>
    );
}
