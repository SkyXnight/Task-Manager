import { prisma } from "@/lib/prisma";

export async function getTopCategories(userId: string) {
    const data = await prisma.task.groupBy({
        by: ["category"],
        where: {
            userId,
        },
        _count: {
            category: true,
        },
        orderBy: {
            _count: {
                category: "desc",
            },
        },
        take: 4,
    });

    return data;
}
