import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

export interface FilterOption<T extends string> {
    value: T;
    label: string;
}

interface Props<T extends string> {
    label: string;
    value: T;
    options: FilterOption<T>[];
    onChange: (value: T) => void;

    icon?: React.ReactNode;
    iconBgColor?: string;
    iconColor?: string;
}

export const FilterSelect: React.FC<Props<string>> = ({
    label,
    value,
    options,
    onChange,
    icon,
    iconBgColor,
    iconColor,
}) => {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className="w-52.5 flex items-center gap-3.5 px-4 py-4 text-left bg-(--main-bg-color) border border-(--border-color) dark:border-neutral-800/60 rounded-lg shadow-sm hover:border-slate-200 dark:hover:border-neutral-700 transition-all duration-200 focus:outline-none group select-none cursor-pointer min-w-40">
                    <div
                        className={twMerge(
                            clsx(
                                "p-2 rounded-full flex items-center justify-center shrink-0 w-9 h-9",
                                iconBgColor,
                                iconColor,
                            ),
                        )}
                    >
                        {icon}
                    </div>

                    <div className="flex flex-col flex-1 gap-1 min-w-0 pr-1">
                        <span className="text-sm font-medium text-slate-400 tracking-wide leading-none mb-1">
                            {label}
                        </span>
                        <span className="text-[15px] font-semibold text-slate-700 dark:text-neutral-200 truncate leading-tight">
                            {options.find((o) => o.value === value)?.label ||
                                value}
                        </span>
                    </div>

                    <ChevronDown className="w-4 h-4 text-slate-400/80 dark:text-neutral-500 group-data-[state=open]:rotate-180 transition-transform duration-200 shrink-0" />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="min-w-45 bg-(--main-bg-color) border border-(--border-color) rounded-xl p-1.5 shadow-xl shadow-slate-200/40 dark:shadow-none animate-in fade-in slide-in-from-top-1 duration-150 z-50"
                    sideOffset={6}
                    align="start"
                >
                    {options.map((option) => (
                        <DropdownMenu.Item
                            key={option.value}
                            onClick={() => onChange(option.value)}
                            className={twMerge(
                                clsx(
                                    "flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg cursor-pointer outline-none transition-colors",
                                    value === option.label
                                        ? "bg-slate-50 dark:bg-neutral-800 text-slate-900 dark:text-white font-semibold"
                                        : "text-slate-600 dark:text-neutral-400 hover:bg-slate-50 dark:hover:bg-neutral-800/50 hover:text-slate-900 dark:hover:text-white",
                                ),
                            )}
                        >
                            {option.label}
                            {value === option.label && (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            )}
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};
