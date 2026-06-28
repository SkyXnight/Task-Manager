"use client";

import { useState } from "react";
import { X, Check, ChevronDown } from "lucide-react";
import { Task } from "@prisma/client";
import { taskSchema } from "@/lib/validations/task.schema";

type Priority = "LOW" | "MEDIUM" | "HIGH";
type Category =
    | "PERSONAL"
    | "WORK"
    | "PROJECT"
    | "STUDY"
    | "DEVELOPMENT"
    | "DESIGN"
    | "MARKETING"
    | "HOME";

type Props = {
    open: boolean;
    onClose: () => void;
    onTaskCreated: (task: Task) => void;
};

const PRIORITIES: { value: Priority; label: string }[] = [
    { value: "LOW", label: "Low" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HIGH", label: "High" },
];

const CATEGORIES: { value: Category; label: string }[] = [
    { value: "PERSONAL", label: "Personal" },
    { value: "WORK", label: "Work" },
    { value: "PROJECT", label: "Project" },
    { value: "STUDY", label: "Study" },
    { value: "DEVELOPMENT", label: "Development" },
    { value: "DESIGN", label: "Design" },
    { value: "MARKETING", label: "Marketing" },
    { value: "HOME", label: "Home" },
];

function Dropdown({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (v: string) => void;
}) {
    const [open, setOpen] = useState(false);

    const selected = options.find((o) => o.value === value);

    return (
        <div className="space-y-2 relative h-18">
            <label className="text-sm font-semibold text-[#344054]">
                {label}
            </label>

            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={`w-full h-11 px-4 flex items-center justify-between rounded-xl ring bg-white text-sm
                transition-all duration-200
                ${
                    open
                        ? "ring-[#087C6D] ring-2"
                        : "ring-slate-200 hover:ring-slate-300"
                }`}
            >
                <span>{selected?.label}</span>
                <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {open && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                    />

                    <div
                        className="
                               absolute left-0 top-full z-50
                               mt-2 w-full
                               rounded-xl border border-slate-200 bg-white shadow-xl
                               max-h-48 overflow-y-auto
                           "
                        style={{
                            willChange: "transform",
                        }}
                    >
                        {options.map((opt) => {
                            const active = opt.value === value;

                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(opt.value);
                                        setOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-2 text-sm
                                    ${
                                        active
                                            ? "bg-[#F0FDF9] text-[#087C6D] font-semibold"
                                            : "text-[#344054] hover:bg-slate-50"
                                    }`}
                                >
                                    {opt.label}
                                    {active && (
                                        <Check className="w-4 h-4 text-[#087C6D]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

export function CreateTaskModal({ open, onClose, onTaskCreated }: Props) {
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<Priority>("MEDIUM");
    const [category, setCategory] = useState<Category>("PERSONAL");
    const [dueDate, setDueDate] = useState("");

    const [errors, setErrors] = useState<Record<string, string>>({});

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = taskSchema.safeParse({
            title,
            description,
            priority,
            category,
            dueDate: dueDate || null,
        });

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                if (err.path[0]) {
                    fieldErrors[err.path[0].toString()] = err.message;
                }
            });

            setErrors(fieldErrors);
            return;
        }

        setErrors({});

        try {
            setLoading(true);

            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(result.data),
            });

            if (!res.ok) throw new Error();

            const task = await res.json();

            onTaskCreated(task);

            setTitle("");
            setDescription("");
            setPriority("MEDIUM");
            setCategory("PERSONAL");
            setDueDate("");

            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-hidden">
            <div className="w-full max-w-2xl rounded-2xl bg-white border border-gray-200 shadow-xl p-6 overflow-visible">
                <div className="flex justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-extrabold">Create task</h2>
                        <p className="text-sm text-gray-500">Add a new task</p>
                    </div>

                    <button onClick={onClose}>
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-sm font-semibold">Title</label>

                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`w-full h-11 mt-2 px-4 rounded-xl ring ring-gray-200 transition-colors
                            focus:outline-none focus:ring-[#087C6D] focus:ring-2
                            ${
                                errors.title ? "ring-red-500" : "ring-slate-200"
                            }`}
                        />

                        {errors.title && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-semibold">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full mt-2 p-3 rounded-xl ring ring-gray-200 resize-none transition-colors
                            focus:outline-none focus:ring-[#087C6D] focus:ring-2"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Dropdown
                            label="Category"
                            value={category}
                            onChange={(v) => setCategory(v as Category)}
                            options={CATEGORIES}
                        />

                        <Dropdown
                            label="Priority"
                            value={priority}
                            onChange={(v) => setPriority(v as Priority)}
                            options={PRIORITIES}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold">
                            Due date (optional)
                        </label>

                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="
                                w-full h-11 mt-2 px-4 rounded-xl ring ring-slate-200
                                text-sm font-medium text-[#101828]
                                transition-all duration-200
                                focus:outline-none
                                focus:ring-[#087C6D]
                                focus:ring-2
                            "
                        />
                    </div>
                    <div className="flex w-full gap-3 pt-4">
                        <button
                            disabled={loading}
                            className="bg-[#087C6D] w-full text-lg font-extrabold cursor-pointer text-white px-5 h-11 rounded-xl hover:bg-[#066A5E] transition-all duration-300"
                        >
                            {loading ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
