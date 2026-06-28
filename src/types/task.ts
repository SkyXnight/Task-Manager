import type { Task } from "@prisma/client";

export type TaskClient = Omit<Task, "dueDate" | "createdAt" | "updatedAt"> & {
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
};
