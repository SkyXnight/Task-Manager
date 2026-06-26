import { prisma } from "@/lib/prisma";
import SettingsClient from "@/components/settings/SettingsClient";
import { getUser } from "@/lib/getUser";

export default async function SettingsPage() {
    const user = await getUser();

    if (!user) {
        return <div>Unauthorized</div>;
    }

    const settings = await prisma.userSettings.findUnique({
        where: { userId: user.id },
    });

    return <SettingsClient user={user} settings={settings} />;
}
