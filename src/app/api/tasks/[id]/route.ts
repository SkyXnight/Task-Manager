import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/getUser";
import { TaskPriority, TaskCategory } from "@prisma/client";

export async function PATCH(
    req: Request,
    context: { params: Promise<{ id: string }> },
) {
    try {
        const session = await getUser();

        if (!session?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const { id } = await context.params;

        const body = await req.json();

        // validate enums
        if (!Object.values(TaskPriority).includes(body.priority)) {
            return NextResponse.json(
                { error: "Invalid priority" },
                { status: 400 },
            );
        }

        if (!Object.values(TaskCategory).includes(body.category)) {
            return NextResponse.json(
                { error: "Invalid category" },
                { status: 400 },
            );
        }

        const parsedDate = body.dueDate ? new Date(body.dueDate) : null;

        const dueDate =
            parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : null;

        const newStatus =
            dueDate && new Date(dueDate) > new Date()
                ? "IN_PROGRESS"
                : "OVERDUE";

        const result = await prisma.task.updateMany({
            where: {
                id,
                userId: session.id,
            },
            data: {
                title: body.title,
                description: body.description ?? "",
                priority: body.priority,
                category: body.category,
                dueDate,
                status: newStatus,
            },
        });

        if (result.count === 0) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 },
            );
        }

        const updatedTask = await prisma.task.findUnique({
            where: { id },
        });

        return NextResponse.json(updatedTask);
    } catch (err) {
        console.error("PATCH TASK ERROR:", err);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } },
) {
    const { id } = params;
    const session = await getUser();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const result = await prisma.task.deleteMany({
            where: {
                id,
                userId: session.id,
            },
        });

        if (result.count === 0) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("DELETE TASK ERROR:", err);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
