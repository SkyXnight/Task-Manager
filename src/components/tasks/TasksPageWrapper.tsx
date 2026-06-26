import { getUser } from "@/lib/getUser";
import { getTasks } from "@/lib/tasks";
import TasksPageClient from "./TasksPageClient";

export default async function TasksPageWrapper() {
    const user = await getUser();
    if (!user) return null;

    const tasks = await getTasks(user.id, {});

    return <TasksPageClient initialTasks={tasks} />;
}
