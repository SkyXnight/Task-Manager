import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(30, "Name is too long"),

    email: z
        .string()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
            message: "Invalid email format",
        })
        .trim(),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(24, "Password is too long"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z
        .string()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
            message: "Invalid email format",
        })
        .trim(),

    password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
