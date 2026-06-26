"use client";

import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

export interface SortOption<T extends string> {
    value: T;
    label: string;
}

interface Props<T extends string> {
    value: T;
    options: SortOption<T>[];
    onChange: (value: T) => void;
}

export const SortSelect: React.FC<Props<string>> = ({
    value,
    options = [],
    onChange,
}) => {
    const selectedOption = options.find((option) => option.value === value);

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-2.5 px-4 py-3.5 text-sm bg-(--main-bg-color) border border-(--border-color) rounded-xl hover:bg-(--menu-item-hover-bg-color)  transition-all duration-150 focus:outline-none group select-none cursor-pointer">
                    <svg
                        className="w-4 h-4 text-[#344054] dark:text-neutral-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m3 16 4 4 4-4" />
                        <path d="M7 20V4" />
                        <path d="m21 8-4-4-4 4" />
                        <path d="M17 4v16" />
                    </svg>

                    <span className="text-[#344054] dark:text-neutral-300 font-semibold">
                        Sort by:{" "}
                        <span className="font-semibold text-slate-700 dark:text-white">
                            {selectedOption?.label ?? "Select"}
                        </span>
                    </span>

                    <ChevronDown
                        className="w-4 h-4 text-[#667085] dark:text-neutral-500 group-data-[state=open]:rotate-180 transition-transform duration-150 ml-0.5"
                        strokeWidth={1.5}
                    />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="min-w-48 bg-(--main-bg-color) border border-(--border-color) dark:border-neutral-800 p-1.5 rounded-xl shadow-lg z-50"
                    sideOffset={4}
                    align="end"
                >
                    {options.map((option) => (
                        <DropdownMenu.Item
                            key={option.value}
                            onClick={() => onChange(option.value)}
                            className={twMerge(
                                clsx(
                                    "flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg cursor-pointer outline-none transition-colors",
                                    value === option.value
                                        ? "bg-slate-50 dark:bg-neutral-800 text-slate-900 dark:text-white font-semibold"
                                        : "text-slate-600 dark:text-neutral-400 hover:bg-slate-50 dark:hover:bg-neutral-800/50",
                                ),
                            )}
                        >
                            {option.label}
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};
