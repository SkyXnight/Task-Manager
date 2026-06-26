"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { updateUserSettings } from "@/actions/settings";
import { updateUserName } from "@/actions/UpdateUserName";
import { useRouter } from "next/navigation";

type Props = {
    user: {
        id: string;
        name: string;
        email: string;
    } | null;

    settings: {
        theme: "LIGHT" | "DARK";
        accent: string;
        taskReminders: boolean;
        dueDateAlerts: boolean;
        weeklySummary: boolean;
        taskNotifications: boolean;
    } | null;
};

export default function SettingsClient({ user, settings }: Props) {
    const router = useRouter();

    const [name, setName] = useState(user?.name ?? "");

    const [theme, setTheme] = useState<"LIGHT" | "DARK">(
        settings?.theme ?? "LIGHT",
    );

    const [accent, setAccent] = useState(settings?.accent ?? "#0DA692");

    const [taskReminders, setTaskReminders] = useState(
        settings?.taskReminders ?? true,
    );

    const [dueDateAlerts, setDueDateAlerts] = useState(
        settings?.dueDateAlerts ?? true,
    );

    const [weeklySummary, setWeeklySummary] = useState(
        settings?.weeklySummary ?? false,
    );

    const [taskNotifications, setTaskNotifications] = useState(
        settings?.taskNotifications ?? false,
    );

    const [loading, setLoading] = useState(false);

    function hexToRgba(hex: string, alpha: number) {
        const clean = hex.replace("#", "");

        const r = parseInt(clean.substring(0, 2), 16);
        const g = parseInt(clean.substring(2, 4), 16);
        const b = parseInt(clean.substring(4, 6), 16);

        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    const applyAllSettings = useCallback(
        (themeValue: "LIGHT" | "DARK", accentValue: string) => {
            document.documentElement.setAttribute("data-theme", themeValue);

            document.documentElement.style.setProperty(
                "--accent-color",
                accentValue,
            );

            document.documentElement.style.setProperty(
                "--accent-bg-color",
                hexToRgba(accentValue, 0.12),
            );
        },
        [],
    );

    useEffect(() => {
        if (!settings) return;

        applyAllSettings(settings.theme, settings.accent);
    }, [settings, applyAllSettings]);

    const handleSave = async () => {
        if (!user) return;

        try {
            setLoading(true);

            await Promise.all([
                updateUserName(user.id, name),
                updateUserSettings(user.id, {
                    theme,
                    accent,
                    taskReminders,
                    dueDateAlerts,
                    weeklySummary,
                    taskNotifications,
                }),
            ]);

            applyAllSettings(theme, accent);

            toast.success("Settings saved successfully");
            router.refresh();
        } catch {
            toast.error("Failed to save settings");
        } finally {
            setLoading(false);
        }
    };

    type ToggleItem = {
        label: string;
        value: boolean;
        set: (v: boolean) => void;
    };

    const toggles: ToggleItem[] = [
        {
            label: "Task Reminders",
            value: taskReminders,
            set: setTaskReminders,
        },
        {
            label: "Due Date Alerts",
            value: dueDateAlerts,
            set: setDueDateAlerts,
        },
        {
            label: "Weekly Summary",
            value: weeklySummary,
            set: setWeeklySummary,
        },
        {
            label: "Task Notifications",
            value: taskNotifications,
            set: setTaskNotifications,
        },
    ];

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as
            | "LIGHT"
            | "DARK"
            | null;
        const savedAccent = localStorage.getItem("accent");

        if (savedTheme || savedAccent) {
            applyAllSettings(
                savedTheme ?? settings?.theme ?? "LIGHT",
                savedAccent ?? settings?.accent ?? "#0DA692",
            );
        }
    }, [settings, applyAllSettings]);

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem("accent", accent);
    }, [accent]);

    return (
        <div className="w-full h-screen mx-auto px-8 py-10 bg-(--bg-color)">
            {/* PROFILE */}
            <section className="rounded-3xl border border-(--border-color) bg-(--main-bg-color) p-7">
                <h2 className="text-lg font-semibold mb-4 text-(--main-text-color)">
                    Profile
                </h2>

                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 border border-(--border-color) rounded-xl px-4 mb-4 text-(--main-text-color)"
                />

                <input
                    value={user?.email ?? ""}
                    readOnly
                    className="w-full h-11 border border-(--border-color) rounded-xl px-4 text-(--main-text-color) bg-(--main-bg-color)"
                />
            </section>

            {/* SETTINGS */}
            <section className="border border-(--border-color) mt-6 rounded-3xl bg-(--main-bg-color) p-7">
                <h2 className="text-lg font-semibold mb-4 text-(--main-text-color)">
                    Appearance
                </h2>

                <select
                    value={theme}
                    onChange={(e) =>
                        setTheme(e.target.value as "LIGHT" | "DARK")
                    }
                    className="appearance-none mb-4 h-11 px-4 pr-10 rounded-xl border border-(--border-color) bg-(--main-bg-color) text-(--main-text-color) cursor-pointer outline-none transition hover:border-(--accent-color) focus:border-(--accent-color)"
                >
                    <option value="LIGHT">Light</option>
                    <option value="DARK">Dark</option>
                </select>

                <div className="flex gap-3">
                    {["#0DA692", "#3B82F6", "#8B5CF6", "#F97316"].map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setAccent(c)}
                            className={`h-8 w-8 rounded-full ${
                                accent === c
                                    ? "ring-2 ring-(--main-text-color)"
                                    : ""
                            }`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
            </section>

            {/* NOTIFICATIONS */}
            <section className="mt-6 rounded-3xl border border-(--border-color) bg-(--main-bg-color) p-7">
                <h2 className="text-lg font-semibold mb-4 text-(--main-text-color)">
                    Notifications
                </h2>

                {toggles.map((item) => (
                    <label
                        key={item.label}
                        className="flex justify-between py-2"
                    >
                        <span className="text-(--main-text-color)">
                            {item.label}
                        </span>

                        <input
                            type="checkbox"
                            checked={item.value}
                            onChange={(e) => item.set(e.target.checked)}
                        />
                    </label>
                ))}
            </section>
            <button
                onClick={handleSave}
                disabled={loading}
                className="mt-4 h-11 w-full flex items-center justify-center font-extrabold text-lg px-5 cursor-pointer rounded-xl bg-(--accent-color) text-white hover:brightness-90 transition-all duration-200"
            >
                {loading ? "Saving..." : "Save Changes"}
            </button>
        </div>
    );
}
