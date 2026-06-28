"use client";

import {
    Pencil,
    Trash2,
    Flag,
    Calendar,
    Briefcase,
    User,
    Palette,
    GraduationCap,
    Laptop,
    Megaphone,
    FolderKanban,
    Tag,
    House,
} from "lucide-react";

import { Task } from "@prisma/client";

interface TaskTableProps {
    tasks: Task[];
    totalTasks: number;

    currentPage: number;
    tasksPerPage: number;
    onPageChange: (page: number) => void;

    selectedTaskIds: string[];
    onToggleSelectAll: () => void;
    onToggleSelectTask: (id: string) => void;

    onEditTask: (id: string) => void;
    onDeleteTask: (id: string) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({
    tasks,
    totalTasks,
    currentPage,
    tasksPerPage,
    onPageChange,
    selectedTaskIds,
    onToggleSelectAll,
    onToggleSelectTask,
    onEditTask,
    onDeleteTask,
}) => {
    const isAllSelected =
        tasks.length > 0 && selectedTaskIds.length === tasks.length;

    const totalPages = Math.max(1, Math.ceil(totalTasks / tasksPerPage));

    const getCategoryStyles = (category: Task["category"]) => {
        switch (category) {
            case "PERSONAL":
                return {
                    bg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
                    icon: <User className="w-3.5 h-3.5 mb-0.5" />,
                };
            case "WORK":
                return {
                    bg: "bg-blue-50 text-blue-600 border border-blue-100",
                    icon: <Briefcase className="w-3.5 h-3.5 mb-0.5" />,
                };
            case "PROJECT":
                return {
                    bg: "bg-purple-50 text-purple-600 border border-purple-100",
                    icon: <FolderKanban className="w-3.5 h-3.5 mb-0.5" />,
                };
            case "HOME":
                return {
                    bg: "bg-yellow-50 text-yellow-600 border border-yellow-100",
                    icon: <House className="w-3.5 h-3.5 mb-0.5" />,
                };
            case "DESIGN":
                return {
                    bg: "bg-red-50 text-red-600 border border-red-100",
                    icon: <Palette className="w-3.5 h-3.5 mb-0.5" />,
                };
            case "STUDY":
                return {
                    bg: "bg-pink-50 text-pink-600 border border-pink-100",
                    icon: <GraduationCap className="w-3.5 h-3.5 mb-0.5" />,
                };
            case "DEVELOPMENT":
                return {
                    bg: "bg-orange-50 text-orange-600 border border-orange-100",
                    icon: <Laptop className="w-3.5 h-3.5 mb-0.5" />,
                };
            case "MARKETING":
                return {
                    bg: "bg-gray-50 text-gray-500 border border-gray-200",
                    icon: <Megaphone className="w-3.5 h-3.5 mb-0.5" />,
                };
            default:
                return {
                    bg: "bg-gray-50 text-gray-500 border border-gray-200",
                    icon: <Tag className="w-3.5 h-3.5 mb-0.5" />,
                };
        }
    };

    const getPriorityStyles = (priority: Task["priority"]) => {
        switch (priority) {
            case "LOW":
                return "text-blue-500 flex gap-1 items-center";
            case "MEDIUM":
                return "text-orange-500 flex gap-1 items-center";
            case "HIGH":
                return "text-red-500 flex gap-1 items-center";
        }
    };

    const getStatusStyles = (status: Task["status"]) => {
        switch (status) {
            case "IN_PROGRESS":
                return "bg-blue-50 text-blue-600 text-sm border border-blue-100 w-34 flex justify-center items-center gap-1 py-0.5 rounded-2xl";
            case "COMPLETED":
                return "bg-emerald-50 text-emerald-600 text-sm border border-emerald-100 w-30 flex justify-center items-center gap-1 px-2 py-0.5 rounded-2xl";
            case "OVERDUE":
                return "bg-red-50 text-red-600 text-sm border border-red-100 w-30 flex justify-center items-center gap-1 px-2 py-0.5 rounded-2xl";
            default:
                return "";
        }
    };

    const getStatusDotColor = (status: Task["status"]) => {
        switch (status) {
            case "IN_PROGRESS":
                return "bg-blue-500";
            case "COMPLETED":
                return "bg-emerald-500";
            case "OVERDUE":
                return "bg-red-500";
        }
    };

    const formatDate = (date: Date | null) => {
        if (!date) return "";

        return new Date(date).toISOString().split("T")[0];
    };

    return (
        <div className="w-full bg-(--main-bg-color) border border-(--border-color) rounded-xl shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)] overflow-hidden mt-4">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 bg-(--main-bg-color) text-[13px] font-semibold text-slate-500 uppercase tracking-wider h-12">
                            <th className="pl-6 w-12">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={onToggleSelectAll}
                                    className="w-4 h-4"
                                />
                            </th>
                            <th className="px-4 py-3">Task</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Priority</th>
                            <th className="px-4 py-3">Due Date</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tasks.map((task) => {
                            const cat = getCategoryStyles(task.category);
                            const isSelected = selectedTaskIds.includes(
                                task.id,
                            );

                            return (
                                <tr
                                    key={task.id}
                                    className={`h-16 hover:bg-slate-50/40 ${
                                        isSelected ? "bg-(--main-bg-color)" : ""
                                    }`}
                                >
                                    <td className="pl-6">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() =>
                                                onToggleSelectTask(task.id)
                                            }
                                            className="w-4 h-4 mt-1"
                                        />
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-(--main-text-color)">
                                                {task.title}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${cat.bg}`}
                                        >
                                            {cat.icon}
                                            {task.category}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        <span
                                            className={getPriorityStyles(
                                                task.priority,
                                            )}
                                        >
                                            <Flag className="w-4 h-4 inline" />{" "}
                                            {task.priority}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 text-gray-400">
                                        <Calendar className="w-4 h-4 inline mb-1" />{" "}
                                        {formatDate(task.dueDate)}
                                    </td>

                                    <td className="px-4 py-3">
                                        <span
                                            className={`${getStatusStyles(
                                                task.status,
                                            )}`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full inline-block ${getStatusDotColor(
                                                    task.status,
                                                )}`}
                                            />
                                            {task.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() =>
                                                    onEditTask(task.id)
                                                }
                                                className="bg-gray-100 p-1 rounded-md cursor-pointer border border-gray-200 text-gray-400 hover:bg-blue-100 hover:text-blue-400 hover:border-blue-200 transition-all duration-200"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    onDeleteTask(task.id)
                                                }
                                                className="bg-gray-100 p-1 rounded-md cursor-pointer border border-gray-200 text-gray-400 hover:bg-red-100 hover:text-red-400 hover:border-red-200 transition-all duration-200"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (
                <div className="flex justify-end items-center px-6 py-4 border-t border-slate-100 bg-white">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="h-10 px-4 rounded-xl cursor-pointer border border-slate-200 bg-white text-sm font-medium text-slate-500 transition-all  hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1,
                        ).map((page) => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`h-10 w-10 rounded-xl cursor-pointer text-sm font-semibold transition-all ${
                                    currentPage === page
                                        ? "bg-[#087C6D] text-white shadow-md shadow-emerald-200"
                                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="h-10 px-4 rounded-xl cursor-pointer border border-slate-200 bg-white text-sm font-medium text-slate-500 transition-all hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
