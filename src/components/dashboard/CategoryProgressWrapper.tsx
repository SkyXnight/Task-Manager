import { getUser } from "@/lib/getUser";
import { getTopCategories } from "@/lib/categories";
import { formatCategoryData } from "@/lib/formatCategoryData";
import CategoryProgress from "./CategoryProgress";

export default async function CategoryProgressWrapper() {
    const user = await getUser();
    if (!user) return null;

    const raw = await getTopCategories(user.id);
    const categories = formatCategoryData(raw);

    return <CategoryProgress categories={categories} />;
}
