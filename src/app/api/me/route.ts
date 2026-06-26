import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
    try {
        const cookie = req.headers.get("cookie");

        if (!cookie) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        const token = cookie
            .split("; ")
            .find((c) => c.startsWith("token="))
            ?.split("=")[1];

        if (!token) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        const decoded = verifyToken(token) as { userId: string };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
            },
        });

        return NextResponse.json({ user });
    } catch {
        return NextResponse.json({ user: null }, { status: 500 });
    }
}
