import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { setAuthCookie } from "@/lib/cookies";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const validation = loginSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    errors: validation.error.flatten().fieldErrors,
                },
                { status: 400 },
            );
        }

        const { email, password } = validation.data;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                {
                    errors: {
                        email: ["User not found"],
                    },
                },
                { status: 404 },
            );
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return NextResponse.json(
                {
                    errors: {
                        password: ["Incorrect password"],
                    },
                },
                { status: 401 },
            );
        }

        const token = signToken({ userId: user.id });
        const cookie = setAuthCookie(token);

        const response = NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
            },
        });

        response.headers.set("Set-Cookie", cookie);

        return response;
    } catch (error) {
        console.error("LOGIN ERROR:");
        console.error(error);

        return Response.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
