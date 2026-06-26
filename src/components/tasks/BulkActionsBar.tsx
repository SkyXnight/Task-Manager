"use client";

import { X, ChevronDown } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

type Props = {
    selectedCount: number;
    onClearSelection: () => void;
    onComplete: () => void;
    onDelete: () => void;
    onChangePriority: (value: "LOW" | "MEDIUM" | "HIGH") => void;
    onChangeCategory: (
        value:
            | "PERSONAL"
            | "WORK"
            | "STUDY"
            | "PROJECT"
            | "DEVELOPMENT"
            | "DESIGN"
            | "MARKETING"
            | "HOME",
    ) => void;
};

export function BulkActionsBar({
    selectedCount,
    onClearSelection,
    onComplete,
    onDelete,
    onChangePriority,
    onChangeCategory,
}: Props) {
    return (
        <div className="mt-4 w-full py-2">
            <div className="flex items-center justify-between w-full h-16 px-6 bg-(--main-bg-color) border border-(--border-color) rounded-xl shadow-sm">
                <div className="flex items-center gap-5">
                    <button
                        onClick={onClearSelection}
                        className="flex items-center hover:bg-(--menu-item-hover-bg-color) transition-all duration-200 p-1 cursor-pointer justify-center w-6 h-6 rounded-full"
                    >
                        <X className="w-5 h-5 text-(--main-text-color)" />
                    </button>

                    <span className="text-sm font-medium text-zinc-600">
                        {selectedCount} selected
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onComplete}
                        className="text-(--main-text-color) px-4 py-2 text-sm cursor-pointer border border-(--border-color) shadow-sm rounded-lg hover:border-emerald-200 hover:text-emerald-600 transition-all duration-300"
                    >
                        Complete
                    </button>

                    <button
                        onClick={onDelete}
                        className="text-(--main-text-color) px-4 py-2 text-sm cursor-pointer border border-(--border-color) shadow-sm rounded-lg hover:text-red-600 hover:border-red-400 transition-all duration-300"
                    >
                        Delete
                    </button>

                    {/* PRIORITY */}
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className="text-(--main-text-color) px-4 py-2 text-sm cursor-pointer border border-(--border-color) shadow-sm rounded-lg flex items-center gap-2">
                                Priority
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Content className="text-(--main-text-color) bg-(--main-bg-color) border border-(--border-color) rounded-lg p-1 shadow-md">
                            {["LOW", "MEDIUM", "HIGH"].map((p) => (
                                <DropdownMenu.Item
                                    key={p}
                                    onClick={() =>
                                        onChangePriority(
                                            p as "LOW" | "MEDIUM" | "HIGH",
                                        )
                                    }
                                    className="px-3 py-2 hover:bg-(--menu-item-hover-bg-color) rounded cursor-pointer"
                                >
                                    {p}
                                </DropdownMenu.Item>
                            ))}
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>

                    {/* CATEGORY */}
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className="text-(--main-text-color) px-4 py-2 text-sm cursor-pointer border border-(--border-color) shadow-sm rounded-lg flex items-center gap-2">
                                Category
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content className="text-(--main-text-color) bg-(--main-bg-color) border border-(--border-color) rounded-lg p-1 shadow-md">
                            {[
                                "PERSONAL",
                                "WORK",
                                "STUDY",
                                "PROJECT",
                                "DEVELOPMENT",
                                "DESIGN",
                                "MARKETING",
                                "HOME",
                            ].map((c) => (
                                <DropdownMenu.Item
                                    key={c}
                                    onClick={() =>
                                        onChangeCategory(
                                            c as
                                                | "PERSONAL"
                                                | "WORK"
                                                | "STUDY"
                                                | "PROJECT"
                                                | "DEVELOPMENT"
                                                | "DESIGN"
                                                | "MARKETING"
                                                | "HOME",
                                        )
                                    }
                                    className="px-3 py-2 hover:bg-(--menu-item-hover-bg-color) rounded cursor-pointer"
                                >
                                    {c}
                                </DropdownMenu.Item>
                            ))}
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                </div>
            </div>
        </div>
    );
}
