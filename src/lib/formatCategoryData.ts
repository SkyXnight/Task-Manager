export function formatCategoryData(data: any[]) {
    const total = data.reduce((sum, item) => sum + item._count.category, 0);

    return data.map((item) => ({
        name: item.category,
        percent: Math.round((item._count.category / total) * 100),
    }));
}
