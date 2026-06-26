import type { Task } from "@/generated/prisma/client";

export type TaskClient = Omit<Task, "dueDate" | "createdAt" | "updatedAt"> & {
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
};
