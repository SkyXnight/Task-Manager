import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value;
    const { pathname } = req.nextUrl;

    const isAuthPage = pathname === "/login" || pathname === "/register";

    const isProtectedPage = !isAuthPage;

    if (!token && isProtectedPage) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (token && isAuthPage) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (token) {
        try {
            verifyToken(token);
        } catch {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|favicon.ico).*)"],
};
