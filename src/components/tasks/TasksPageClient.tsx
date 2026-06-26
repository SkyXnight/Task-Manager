"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Circle, Folder, Flag } from "lucide-react";

import { FilterSelect } from "@/components/tasks/FilterSelect";
import { BulkActionsBar } from "@/components/tasks/BulkActionsBar";
import { TaskTable } from "@/components/tasks/TaskTable";
import { Task } from "@/generated/prisma/client";
import { SortSelect } from "@/components/tasks/SortSelect";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";
import { EditTaskModal } from "./EditTaskModal";

type Status = "ALL" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";
type Category =
    | "ALL"
    | "PERSONAL"
    | "WORK"
    | "STUDY"
    | "PROJECT"
    | "DEVELOPMENT"
    | "DESIGN"
    | "MARKETING"
    | "HOME";

type Priority = "ALL" | "LOW" | "MEDIUM" | "HIGH";

type SortBy =
    | "title_asc"
    | "title_desc"
    | "due_date_asc"
    | "due_date_desc"
    | "created_newest"
    | "created_oldest";

type BulkAction =
    | { action: "complete"; ids: string[] }
    | { action: "delete"; ids: string[] }
    | { action: "priority"; ids: string[]; value: "LOW" | "MEDIUM" | "HIGH" }
    | {
          action: "category";
          ids: string[];
          value:
              | "PERSONAL"
              | "WORK"
              | "STUDY"
              | "PROJECT"
              | "DEVELOPMENT"
              | "DESIGN"
              | "MARKETING"
              | "HOME";
      };

type Props = {
    initialTasks: Task[];
};

export default function TasksPageClient({ initialTasks }: Props) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    const [status, setStatus] = useState<Status>("ALL");
    const [category, setCategory] = useState<Category>("ALL");
    const [priority, setPriority] = useState<Priority>("ALL");
    const [sortBy, setSortBy] = useState<SortBy>("due_date_asc");
    const [search, setSearch] = useState("");
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const tasksPerPage = 8;

    const updateFilter = <T,>(
        setter: React.Dispatch<React.SetStateAction<T>>,
        value: T,
    ) => {
        setter(value);
        setCurrentPage(1);
        setSelectedTaskIds([]);
    };

    const filteredTasks = useMemo(() => {
        return tasks
            .filter((t) => {
                if (status !== "ALL" && t.status !== status) return false;
                if (category !== "ALL" && t.category !== category) return false;
                if (priority !== "ALL" && t.priority !== priority) return false;

                if (
                    search &&
                    !t.title.toLowerCase().includes(search.toLowerCase())
                ) {
                    return false;
                }

                return true;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "title_asc":
                        return a.title.localeCompare(b.title);
                    case "title_desc":
                        return b.title.localeCompare(a.title);
                    case "due_date_asc":
                        return (
                            new Date(a.dueDate ?? 0).getTime() -
                            new Date(b.dueDate ?? 0).getTime()
                        );
                    case "due_date_desc":
                        return (
                            new Date(b.dueDate ?? 0).getTime() -
                            new Date(a.dueDate ?? 0).getTime()
                        );
                    case "created_newest":
                        return (
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                        );
                    case "created_oldest":
                        return (
                            new Date(a.createdAt).getTime() -
                            new Date(b.createdAt).getTime()
                        );
                    default:
                        return 0;
                }
            });
    }, [tasks, status, category, priority, search, sortBy]);

    const indexOfLast = currentPage * tasksPerPage;
    const indexOfFirst = indexOfLast - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirst, indexOfLast);

    const bulkAction = async (body: BulkAction) => {
        await fetch("/api/tasks/bulk", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (body.action === "delete") {
            setTasks((prev) => prev.filter((t) => !body.ids.includes(t.id)));
        }

        if (body.action === "complete") {
            setTasks((prev) =>
                prev.map((t) =>
                    body.ids.includes(t.id) ? { ...t, status: "COMPLETED" } : t,
                ),
            );
        }

        if (body.action === "priority") {
            setTasks((prev) =>
                prev.map((t) =>
                    body.ids.includes(t.id)
                        ? { ...t, priority: body.value }
                        : t,
                ),
            );
        }

        if (body.action === "category") {
            setTasks((prev) =>
                prev.map((t) =>
                    body.ids.includes(t.id)
                        ? { ...t, category: body.value }
                        : t,
                ),
            );
        }

        setSelectedTaskIds([]);
    };

    const clearFilters = () => {
        setStatus("ALL");
        setCategory("ALL");
        setPriority("ALL");
        setSearch("");
        setSortBy("due_date_asc");
    };

    return (
        <div className="bg-(--bg-color) w-full min-h-screen flex flex-col px-15 pb-10">
            <div className="w-full flex justify-between items-center h-20">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-extrabold text-(--main-text-color)">
                        Tasks
                    </h1>
                    <span className="text-gray-500">
                        Manage or organize your tasks
                    </span>
                </div>

                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 bg-(--accent-color) h-10 px-4 rounded-lg text-white font-semibold cursor-pointer hover:brightness-115 transition-all duration-300"
                >
                    <Plus />
                    Add Task
                </button>
            </div>

            <div className="flex gap-7 items-center relative">
                <div className="flex h-14 pl-5 gap-2 items-center border border-(--border-color) shadow-sm bg-(--main-bg-color) text-gray-400 font-bold rounded-lg w-75">
                    <Search className="text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search tasks..."
                        className="w-full outline-none"
                    />
                </div>

                <FilterSelect
                    label="Status"
                    value={status}
                    onChange={(v) => updateFilter(setStatus, v as Status)}
                    options={[
                        { value: "ALL", label: "All Status" },
                        { value: "IN_PROGRESS", label: "In Progress" },
                        { value: "COMPLETED", label: "Completed" },
                        { value: "OVERDUE", label: "Overdue" },
                    ]}
                    icon={<Circle />}
                    iconBgColor="bg-blue-50"
                    iconColor="text-blue-500"
                />

                <FilterSelect
                    label="Category"
                    value={category}
                    onChange={(v) => updateFilter(setCategory, v as Category)}
                    options={[
                        { value: "ALL", label: "All Category" },
                        { value: "PERSONAL", label: "Personal" },
                        { value: "WORK", label: "Work" },
                        { value: "PROJECT", label: "Project" },
                        { value: "STUDY", label: "Study" },
                        { value: "DEVELOPMENT", label: "Development" },
                        { value: "DESIGN", label: "Design" },
                        { value: "MARKETING", label: "Marketing" },
                        { value: "HOME", label: "Home" },
                    ]}
                    icon={<Folder />}
                    iconBgColor="bg-emerald-50"
                    iconColor="text-emerald-500"
                />

                <FilterSelect
                    label="Priority"
                    value={priority}
                    onChange={(v) => updateFilter(setPriority, v as Priority)}
                    options={[
                        { value: "ALL", label: "All Priority" },
                        { value: "LOW", label: "Low" },
                        { value: "MEDIUM", label: "Medium" },
                        { value: "HIGH", label: "High" },
                    ]}
                    icon={<Flag />}
                    iconBgColor="bg-orange-50"
                    iconColor="text-orange-500"
                />

                <div className="absolute right-0 flex gap-4 items-center">
                    <button
                        onClick={clearFilters}
                        className="font-bold text-gray-600 cursor-pointer hover:text-gray-800 transition-all duration-300"
                    >
                        Clear Filters
                    </button>

                    <SortSelect
                        value={sortBy}
                        onChange={(v) => setSortBy(v as SortBy)}
                        options={[
                            { value: "title_asc", label: "Title A-Z" },
                            { value: "title_desc", label: "Title Z-A" },
                            { value: "due_date_asc", label: "Due ↑" },
                            { value: "due_date_desc", label: "Due ↓" },
                            { value: "created_newest", label: "Newest" },
                            { value: "created_oldest", label: "Oldest" },
                        ]}
                    />
                </div>
            </div>

            <BulkActionsBar
                selectedCount={selectedTaskIds.length}
                onClearSelection={() => setSelectedTaskIds([])}
                onComplete={() =>
                    bulkAction({ action: "complete", ids: selectedTaskIds })
                }
                onDelete={() =>
                    bulkAction({ action: "delete", ids: selectedTaskIds })
                }
                onChangePriority={(value) =>
                    bulkAction({
                        action: "priority",
                        ids: selectedTaskIds,
                        value,
                    })
                }
                onChangeCategory={(value) =>
                    bulkAction({
                        action: "category",
                        ids: selectedTaskIds,
                        value,
                    })
                }
            />

            <TaskTable
                tasks={currentTasks}
                totalTasks={filteredTasks.length}
                currentPage={currentPage}
                tasksPerPage={tasksPerPage}
                onPageChange={setCurrentPage}
                selectedTaskIds={selectedTaskIds}
                onToggleSelectAll={() =>
                    setSelectedTaskIds(
                        selectedTaskIds.length === currentTasks.length
                            ? []
                            : currentTasks.map((t) => t.id),
                    )
                }
                onToggleSelectTask={(id) =>
                    setSelectedTaskIds((prev) =>
                        prev.includes(id)
                            ? prev.filter((x) => x !== id)
                            : [...prev, id],
                    )
                }
                onEditTask={(id) => {
                    const task = tasks.find((t) => t.id === id);
                    if (task) setEditingTask(task);
                }}
                onDeleteTask={async (id) => {
                    await fetch(`/api/tasks/${id}`, {
                        method: "DELETE",
                    });

                    setTasks((prev) => prev.filter((t) => t.id !== id));
                }}
            />
            <CreateTaskModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onTaskCreated={(task) => setTasks((prev) => [task, ...prev])}
            />
            <EditTaskModal
                key={editingTask?.id}
                open={!!editingTask}
                task={editingTask}
                onClose={() => setEditingTask(null)}
                onTaskUpdated={(updatedTask) => {
                    setTasks((prev) =>
                        prev.map((t) =>
                            t.id === updatedTask.id ? updatedTask : t,
                        ),
                    );
                    setEditingTask(null);
                }}
            />
        </div>
    );
}
