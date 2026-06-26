import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { getUserSettings } from "@/actions/settings";
import { getUser } from "@/lib/getUser";
import ThemeProvider from "@/components/ThemeProvider";

function hexToRgba(hex: string, alpha: number) {
    const clean = hex.replace("#", "");

    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "TaskFlow",
    description: "Task Management App",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();
    const settings = await getUserSettings(user?.id);

    const theme = settings?.theme ?? "LIGHT";
    const accent = settings?.accent ?? "#0DA692";

    const accentBg = hexToRgba(accent, 0.1);

    return (
        <html lang="en" className={theme === "DARK" ? "dark" : ""}>
            <body
                style={
                    {
                        "--accent-color": accent,
                        "--accent-bg-color": accentBg,
                    } as React.CSSProperties
                }
                className={`${inter.variable} antialiased`}
            >
                {children}
                <Toaster position="top-right" />
                <ThemeProvider
                    theme={settings?.theme ?? "LIGHT"}
                    accent={settings?.accent ?? "#0DA692"}
                />
            </body>
        </html>
    );
}
