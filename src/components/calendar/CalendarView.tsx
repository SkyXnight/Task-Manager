"use client";

import React, { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    Tag,
} from "lucide-react";

import type { TaskClient } from "@/types/task";

interface CalendarViewProps {
    tasks: TaskClient[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const toDateStr = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const [selectedDateStr, setSelectedDateStr] = useState<string>(
        toDateStr(new Date()),
    );

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();

    const adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const formatDay = (day: number) => {
        const d = new Date(year, month, day);
        return toDateStr(d);
    };

    const getTasksForDay = (day: number) => {
        const date = formatDay(day);
        return tasks.filter((t) => t.dueDate === date);
    };

    const getCategoryDotColor = (category: TaskClient["category"]) => {
        switch (category) {
            case "PERSONAL":
                return "bg-emerald-500";
            case "WORK":
                return "bg-blue-500";
            case "PROJECT":
                return "bg-purple-500";
            default:
                return "bg-gray-400";
        }
    };

    const renderDays = () => {
        const cells = [];

        for (let i = 0; i < adjustedFirstDayIndex; i++) {
            cells.push(
                <div
                    key={`empty-${i}`}
                    className="bg-slate-50/30 border-b border-r border-(--border-color) h-32"
                />,
            );
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = formatDay(day);
            const isSelected = dateStr === selectedDateStr;
            const dayTasks = getTasksForDay(day);

            cells.push(
                <div
                    key={day}
                    onClick={() => setSelectedDateStr(dateStr)}
                    className={`border-b border-r border-(--border-color) h-32 p-2 flex flex-col justify-between transition-all cursor-pointer hover:bg-slate-50/60 ${
                        isSelected
                            ? "bg-(--main-bg-color) font-medium"
                            : "bg-(--main-bg-color)"
                    }`}
                >
                    <div className="flex justify-between items-center">
                        <span
                            className={`w-7 h-7 flex items-center justify-center text-[14px] rounded-lg ${
                                isSelected
                                    ? "bg-(--accent-color) text-(--main-text-color) font-semibold"
                                    : "text-slate-700"
                            }`}
                        >
                            {day}
                        </span>

                        {dayTasks.length > 0 && (
                            <span className="text-[11px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-md">
                                {dayTasks.length}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1 mt-1 overflow-hidden">
                        {dayTasks.slice(0, 2).map((task) => (
                            <div
                                key={task.id}
                                className="text-[11px] px-1.5 py-0.5 rounded border border-gray-100 bg-slate-50/50 truncate text-slate-700 flex items-center gap-1"
                            >
                                <span
                                    className={`w-1.5 h-1.5 rounded-full ${getCategoryDotColor(
                                        task.category,
                                    )}`}
                                />
                                <span className="truncate">{task.title}</span>
                            </div>
                        ))}
                    </div>
                </div>,
            );
        }

        return cells;
    };

    const selectedDayTasks = tasks.filter((t) => t.dueDate === selectedDateStr);

    return (
        <div className="w-full flex gap-6 mt-6 items-start">
            <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-slate-500" />
                        <h2 className="text-lg font-bold text-slate-800">
                            {monthNames[month]} {year}
                        </h2>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={handlePrevMonth}
                            className="p-1.5 border border-gray-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => {
                                const today = new Date();

                                setCurrentDate(
                                    new Date(
                                        today.getFullYear(),
                                        today.getMonth(),
                                        1,
                                    ),
                                );

                                setSelectedDateStr(toDateStr(today));
                            }}
                            className="px-3 h-7 border border-gray-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                            Today
                        </button>

                        <button
                            onClick={handleNextMonth}
                            className="p-1.5 border border-gray-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 text-center border-b border-gray-100 bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider py-2">
                    {daysOfWeek.map((d) => (
                        <div key={d}>{d}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 border-l border-t border-gray-50 bg-slate-50/10">
                    {renderDays()}
                </div>
            </div>

            <div className="w-80 bg-white border border-gray-200 max-h-176.25 overflow-y-auto rounded-xl shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)] p-5 sticky top-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Schedule
                </h3>

                <p className="text-[15px] font-bold text-slate-800 mb-4">
                    {selectedDateStr}
                </p>

                <div className="flex flex-col gap-3">
                    {selectedDayTasks.length === 0 ? (
                        <div className="text-sm text-slate-400">
                            No tasks scheduled for this day.
                        </div>
                    ) : (
                        selectedDayTasks.map((task) => (
                            <div
                                key={task.id}
                                className="p-3 border border-gray-100 rounded-xl"
                            >
                                <div className="font-semibold text-sm mb-2">
                                    {task.title}
                                </div>

                                <div className="text-xs text-slate-500 flex gap-1 items-center">
                                    <Clock className="w-3.5 h-3.5" />
                                    Due: {task.dueDate}
                                </div>

                                <div className="text-xs flex gap-1 items-center mt-1">
                                    <Tag className="w-3.5 h-3.5" />
                                    {task.category}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
