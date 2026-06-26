import { prisma } from "@/lib/prisma";

export default async function ProgressBar() {
    const [totalTasks, completedTasks] = await Promise.all([
        prisma.task.count(),
        prisma.task.count({
            where: {
                status: "COMPLETED",
            },
        }),
    ]);

    const progress =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <div className="bg-(--main-bg-color) rounded-xl border border-(--border-color) p-5 shadow-lg">
            <h2 className="font-extrabold text-xl mb-4 text-(--main-text-color)">
                Progress
            </h2>

            <h3 className="text-5xl font-bold text-(--accent-color)">
                {progress}%
            </h3>

            <div className="w-full h-3 bg-gray-200 rounded-full mt-4 overflow-hidden">
                <div
                    className="h-full bg-(--accent-color) rounded-full transition-all duration-500"
                    style={{
                        width: `${progress}%`,
                    }}
                />
            </div>

            <p className="mt-3 text-gray-500">
                {completedTasks} of {totalTasks} tasks completed
            </p>
        </div>
    );
}
