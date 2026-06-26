import { z } from "zod";

export const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),

    category: z.enum([
        "PERSONAL",
        "WORK",
        "PROJECT",
        "STUDY",
        "DEVELOPMENT",
        "DESIGN",
        "MARKETING",
        "HOME",
    ]),

    priority: z.enum(["LOW", "MEDIUM", "HIGH"]),

    dueDate: z.string().optional().nullable(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
