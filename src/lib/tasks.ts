import { prisma } from "@/lib/prisma";
import { TaskStatus, TaskPriority, TaskCategory } from "@prisma/client";

export type TaskFilters = {
    status?: string;
    category?: string;
    priority?: string;
    search?: string;
};

function toEnum<T extends Record<string, string>>(
    value: string | undefined,
    enumObj: T,
) {
    if (!value) return undefined;

    const normalized = value.toUpperCase();

    return Object.values(enumObj).includes(normalized as T[keyof T])
        ? (normalized as T[keyof T])
        : undefined;
}

export async function getTasks(userId: string, filters: TaskFilters) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.task.updateMany({
        where: {
            userId,
            status: "IN_PROGRESS",
            dueDate: {
                lt: today,
            },
        },
        data: {
            status: "OVERDUE",
        },
    });

    const tasks = await prisma.task.findMany({
        where: {
            userId,

            ...(toEnum(filters.status, TaskStatus) && {
                status: toEnum(filters.status, TaskStatus),
            }),

            ...(toEnum(filters.category, TaskCategory) && {
                category: toEnum(filters.category, TaskCategory),
            }),

            ...(toEnum(filters.priority, TaskPriority) && {
                priority: toEnum(filters.priority, TaskPriority),
            }),

            ...(filters.search && {
                title: {
                    contains: filters.search,
                    mode: "insensitive",
                },
            }),
        },

        orderBy: {
            createdAt: "desc",
        },
    });

    return tasks.map((task) => {
        const isOverdue =
            task.dueDate && task.status !== "COMPLETED" && task.dueDate < today;

        return {
            ...task,
            status: isOverdue ? "OVERDUE" : task.status,
        };
    });
}
