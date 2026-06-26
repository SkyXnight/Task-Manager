"use client";

import { useEffect } from "react";

interface Props {
    theme: "LIGHT" | "DARK";
    accent: string;
}

function hexToRgba(hex: string, alpha: number) {
    const clean = hex.replace("#", "");

    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function ThemeProvider({ theme, accent }: Props) {
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);

        document.documentElement.style.setProperty("--accent-color", accent);

        document.documentElement.style.setProperty(
            "--accent-bg-color",
            hexToRgba(accent, 0.12),
        );
    }, [theme, accent]);

    return null;
}
