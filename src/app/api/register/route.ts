import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { setAuthCookie } from "@/lib/cookies";
import { registerSchema } from "@/lib/validations/auth";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const file = formData.get("image") as File | null;

        const validation = registerSchema.safeParse({
            name,
            email,
            password,
        });

        if (!validation.success) {
            const errors = z.flattenError(validation.error);

            return NextResponse.json({
                errors: errors.fieldErrors,
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    errors: {
                        email: ["User with this email already exists"],
                    },
                },
                { status: 400 },
            );
        }

        let image: string | null = null;

        if (file && file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                {
                    errors: {
                        image: ["Image must be less than 5MB"],
                    },
                },
                { status: 400 },
            );
        }

        if (file) {
            const fileName = `${Date.now()}-${file.name}`;

            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const { error } = await supabase.storage
                .from("avatars")
                .upload(fileName, buffer, {
                    contentType: file.type,
                    upsert: false,
                });

            if (error) {
                console.log("Supabase upload error:", error);
                return NextResponse.json(
                    { errors: { image: ["Upload failed"] } },
                    { status: 500 },
                );
            }

            const { data: publicUrlData } = supabase.storage
                .from("avatars")
                .getPublicUrl(fileName);

            image = publicUrlData.publicUrl;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                image,
                settings: {
                    create: {},
                },
            },
        });

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
    } catch {
        return NextResponse.json(
            { error: "Registration failed" },
            { status: 500 },
        );
    }
}
