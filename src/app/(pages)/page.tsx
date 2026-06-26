import { Pencil } from "lucide-react";
import TaskStats from "../../components/dashboard/TaskStats";
import RecentTasks from "../../components/dashboard/RecentTasks";
import TodayTasks from "../../components/dashboard/TodayTasks";
import ProgressBar from "../../components/dashboard/ProgressBar";
import CategoryProgressWrapper from "@/components/dashboard/CategoryProgressWrapper";
import Link from "next/link";

export default async function Home() {
    const date = new Date();

    const formattedDate = date.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div className=" bg-(--bg-color) w-full h-full flex flex-col px-15 pt-3 pb-10">
            <div className="w-full h-20 flex justify-between items-center mb-3">
                <div>
                    <h1 className="font-extrabold text-2xl tracking-wide text-(--main-text-color)">
                        Dashboard
                    </h1>
                    <p className="text-gray-500 tracking-wide">
                        {formattedDate}
                    </p>
                </div>
                <Link
                    href="/tasks"
                    className="flex items-center gap-2 bg-(--accent-color) h-10 px-4 rounded-lg text-[17px] tracking-wide text-white font-semibold cursor-pointer hover:brightness-115 transition-all duration-200"
                >
                    <Pencil className="w-5.5 h-5.5" />
                    Add Task
                </Link>
            </div>
            <TaskStats />
            <div className="w-full h-137 mt-10 flex gap-8 mb-10">
                <RecentTasks />
                <div className="w-[40%] flex flex-col gap-6">
                    <TodayTasks />
                    <ProgressBar />
                </div>
            </div>
            <CategoryProgressWrapper />
        </div>
    );
}
