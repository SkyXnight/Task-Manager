import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { getUser } from "@/lib/getUser";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen">
            <aside className="fixed left-0 top-0 h-screen">
                <Sidebar />
            </aside>

            <main className="ml-70 flex min-h-screen flex-col bg-white dark:bg-[#262626]">
                <Topbar />

                <div className="mt-18 flex-1">{children}</div>
            </main>
        </div>
    );
}
