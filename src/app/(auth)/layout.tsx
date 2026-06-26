import { getUser } from "@/lib/getUser";
import { redirect } from "next/navigation";

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();
    if (user) {
        redirect("/");
    }

    return (
        <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
            {children}
        </main>
    );
}
