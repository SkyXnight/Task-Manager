import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/getUser";

export async function PATCH(req: Request) {
    const session = await getUser();

    if (!session?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ids, action, value } = await req.json();

    if (action === "complete") {
        await prisma.task.updateMany({
            where: { id: { in: ids } },
            data: { status: "COMPLETED" },
        });
    }

    if (action === "priority") {
        await prisma.task.updateMany({
            where: { id: { in: ids } },
            data: { priority: value },
        });
    }

    if (action === "category") {
        await prisma.task.updateMany({
            where: { id: { in: ids } },
            data: { category: value },
        });
    }

    if (action === "delete") {
        await prisma.task.deleteMany({
            where: {
                id: { in: ids },
                userId: session.id,
            },
        });
    }

    console.log("SESSION:", session.id);
    console.log("IDS:", ids);

    return NextResponse.json({ success: true });
}
