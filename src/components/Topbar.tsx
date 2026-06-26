import { User } from "lucide-react";
import { getUser } from "@/lib/getUser";
import { LogoutButton } from "./LogoutButton";
import Image from "next/image";

export default async function Topbar() {
    const user = await getUser();

    return (
        <div className="fixed top-0 left-70 right-0 z-50 h-18 border-b border-(--border-color) bg-(--main-bg-color)  flex items-center justify-between pl-15 pr-8">
            <h1 className="text-[22px] font-bold text-(--main-text-color)">
                Welcome back, {user?.name}
            </h1>

            <div className="flex gap-5 items-center">
                <div className="flex gap-2 items-center">
                    <div className="w-10 h-10 bg-[#EDFBF8] flex items-center justify-center rounded-full overflow-hidden">
                        {user?.image ? (
                            <Image
                                src={user.image}
                                alt="Avatar"
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-[#0B8F7E]">
                                <User />
                            </div>
                        )}
                    </div>
                    <span className="font-semibold text-gray-400">
                        {user?.email}
                    </span>
                </div>
                <LogoutButton />
            </div>
        </div>
    );
}
