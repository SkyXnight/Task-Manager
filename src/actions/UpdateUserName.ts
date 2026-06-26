"use server";

import { prisma } from "@/lib/prisma";

export async function updateUserName(userId: string, name: string) {
    return prisma.user.update({
        where: { id: userId },
        data: { name },
    });
}
