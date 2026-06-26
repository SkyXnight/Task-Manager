"use server";

import { prisma } from "@/lib/prisma";

export async function getUserSettings(userId?: string) {
    if (!userId) return null;

    return prisma.userSettings.findUnique({
        where: {
            userId,
        },
    });
}

export async function updateUserSettings(
    userId: string,
    data: {
        theme: "LIGHT" | "DARK";
        accent: string;
        taskReminders: boolean;
        dueDateAlerts: boolean;
        weeklySummary: boolean;
        taskNotifications: boolean;
    },
) {
    return prisma.userSettings.upsert({
        where: { userId },
        update: data,
        create: {
            userId,
            ...data,
        },
    });
}
