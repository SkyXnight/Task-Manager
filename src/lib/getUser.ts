import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import { prisma } from "./prisma";

export async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    try {
        const payload = verifyToken(token);

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            include: {
                tasks: true,
            },
        });

        return user;
    } catch {
        return null;
    }
}
