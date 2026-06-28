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
    task: Task | null;
    onClose: () => void;
    onTaskUpdated: (task: Task) => void;
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
        <div className="space-y-2 relative">
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

                    <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-xl max-h-48 overflow-y-auto">
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

export function EditTaskModal({ open, task, onClose, onTaskUpdated }: Props) {
    const [loading, setLoading] = useState(false);

    const [dueDate, setDueDate] = useState("");

    const [errors, setErrors] = useState<Record<string, string>>({});

    const [title, setTitle] = useState(task?.title ?? "");
    const [description, setDescription] = useState(task?.description ?? "");
    const [priority, setPriority] = useState<Priority>(
        (task?.priority as Priority) ?? "MEDIUM",
    );
    const [category, setCategory] = useState<Category>(
        (task?.category as Category) ?? "PERSONAL",
    );

    if (!open || !task) return null;

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

            const res = await fetch(`/api/tasks/${task.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(result.data),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data?.error || "Update failed");

            onTaskUpdated(data);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-2xl bg-white border border-gray-200 shadow-xl p-6">
                <div className="flex justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-extrabold">Edit task</h2>
                        <p className="text-sm text-gray-500">
                            Update your task
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center  cursor-pointer rounded-full hover:bg-gray-100"
                    >
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-sm font-semibold">Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`w-full h-11 mt-2 px-4 rounded-xl ring transition-colors
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
                            className="w-full mt-2 p-3 rounded-xl ring ring-slate-200 resize-none focus:outline-none focus:ring-[#087C6D] focus:ring-2"
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
                            Due date
                        </label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full h-11 mt-2 px-4 rounded-xl ring ring-slate-200 focus:outline-none focus:ring-[#087C6D] focus:ring-2"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            disabled={loading}
                            className="w-full h-11 text-lg rounded-xl bg-[#087C6D] text-white cursor-pointer font-extrabold hover:bg-[#066A5E]"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
