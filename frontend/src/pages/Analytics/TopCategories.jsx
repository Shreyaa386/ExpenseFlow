import { useMemo } from "react";
import Card, { CardHeader, CardTitle } from "../../components/ui/Card";
import { getCategoryIconMeta } from "../../constants/categoryIcons";

function TopCategories({ transactions = [] }) {
  const { categories, totalExpense } = useMemo(() => {
    const categoryMap = {};
    let total = 0;

    transactions.forEach((transaction) => {
      if (transaction.type !== "expense") return;

      const category = transaction.category || "Other";
      const amt = Number(transaction.amount) || 0;
      if (!categoryMap[category]) {
        categoryMap[category] = { count: 0, amount: 0 };
      }
      categoryMap[category].count += 1;
      categoryMap[category].amount += amt;
      total += amt;
    });

    const list = Object.entries(categoryMap)
      .map(([name, data]) => ({
        name,
        amount: data.amount,
        count: data.count,
        percentage: total > 0 ? Math.round((data.amount / total) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return { categories: list, totalExpense: total };
  }, [transactions]);

  if (categories.length === 0) {
    return (
      <Card className="p-6">
        <CardHeader className="pb-4">
          <div>
            <CardTitle>Top Spending Classifications</CardTitle>
            <p className="mt-1 text-xs text-[#66736E]">
              Ranked outflow volume by category.
            </p>
          </div>
        </CardHeader>
        <div className="py-10 text-center text-xs text-[#66736E]">
          No expenditure categories recorded in this timeframe.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardHeader className="flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-6">
        <div>
          <CardTitle>Top Spending Classifications</CardTitle>
          <p className="mt-1 text-xs text-[#66736E]">
            Hierarchical analysis of expenditure drivers.
          </p>
        </div>

        <span className="text-xs text-[#66736E] font-medium">
          Total Analyzed Outflow: <strong className="text-[#102A2A] font-mono">₹{totalExpense.toLocaleString()}</strong>
        </span>
      </CardHeader>

      <div className="space-y-4">
        {categories.map((category) => {
          const meta = getCategoryIconMeta(category.name);
          const Icon = meta.icon;

          return (
            <div
              key={category.name}
              className="rounded-2xl border border-[#E8E7DE] bg-[#F8F7F0] p-4 transition hover:border-[#D5D3C8]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E8E7DE] ${meta.bg}`}
                  >
                    <Icon size={20} className={meta.color} />
                  </div>

                  <div className="min-w-0">
                    <h4 className="truncate font-bold text-[#102A2A] text-sm">
                      {category.name}
                    </h4>
                    <p className="text-xs text-[#66736E] mt-0.5">
                      {category.count} transaction{category.count === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm sm:text-base font-bold text-[#102A2A] font-mono">
                    ₹{category.amount.toLocaleString("en-IN")}
                  </span>
                  <span className="block text-xs text-[#087F68] font-mono font-medium">
                    {category.percentage}% of total
                  </span>
                </div>
              </div>

              {/* Proportional Progress Bar */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#E8E7DE]">
                <div
                  className="h-full rounded-full bg-[#087F68] transition-all duration-500"
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default TopCategories;