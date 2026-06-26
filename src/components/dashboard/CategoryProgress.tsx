type Props = {
    categories: {
        name: string;
        percent: number;
    }[];
};

export default function CategoryProgress({ categories }: Props) {
    const colors = ["#0da692", "#3b82f6", "#f97316", "#a855f7"];

    const isEmpty = !categories || categories.length === 0;

    return (
        <div className="bg-(--main-bg-color) rounded-xl p-6 border border-(--border-color) shadow-lg">
            <h3 className="font-extrabold text-xl mb-5 text-(--main-text-color)">
                Tasks by Category
            </h3>

            {isEmpty ? (
                <div className="text-sm text-gray-400 font-medium">
                    No categories yet — create tasks to see analytics
                </div>
            ) : (
                <div className="flex gap-6">
                    {categories.map((cat, i) => (
                        <div key={cat.name} className="flex-1">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-extrabold text-gray-600 capitalize">
                                    {cat.name.toLowerCase()}
                                </span>

                                <span className="font-extrabold text-gray-400">
                                    {cat.percent}%
                                </span>
                            </div>

                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-2 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${cat.percent}%`,
                                        backgroundColor:
                                            colors[i % colors.length],
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
