import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/getUser";

export async function POST(req: Request) {
    const session = await getUser();

    if (!session?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const task = await prisma.task.create({
        data: {
            title: body.title,
            description: body.description || null,
            priority: body.priority,
            category: body.category,
            dueDate: body.dueDate ? new Date(body.dueDate) : null,

            userId: session.id,
        },
    });

    return NextResponse.json(task);
}