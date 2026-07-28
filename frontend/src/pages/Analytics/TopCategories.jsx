import { useMemo } from "react";
import {
  Utensils,
  ShoppingBag,
  Car,
  HeartPulse,
  Wallet,
  Landmark,
  CircleDollarSign,
} from "lucide-react";

const iconMap = {
  Food: Utensils,
  Shopping: ShoppingBag,
  Travel: Car,
  Health: HeartPulse,
  Bills: Landmark,
  Salary: CircleDollarSign,
};

const colorMap = {
  Food: {
    bg: "bg-orange-500/15",
    text: "text-orange-400",
  },
  Shopping: {
    bg: "bg-pink-500/15",
    text: "text-pink-400",
  },
  Travel: {
    bg: "bg-blue-500/15",
    text: "text-blue-400",
  },
  Health: {
    bg: "bg-red-500/15",
    text: "text-red-400",
  },
  Bills: {
    bg: "bg-indigo-500/15",
    text: "text-indigo-400",
  },
  Salary: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
  },
};

function TopCategories({ transactions }) {
  const categories = useMemo(() => {
    const categoryMap = {};

    transactions.forEach((transaction) => {
      if (transaction.type !== "expense") return;

      const category = transaction.category || "Other";

      categoryMap[category] =
        (categoryMap[category] || 0) + Number(transaction.amount);
    });

    return Object.entries(categoryMap)
      .map(([name, amount]) => ({
        name,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-semibold text-white">
        Top Spending Categories
      </h2>

      <div className="space-y-4">
        {categories.map((category) => {
          const Icon = iconMap[category.name] || Wallet;

          const colors = colorMap[category.name] || {
            bg: "bg-slate-700",
            text: "text-slate-300",
          };

          return (
            <div
              key={category.name}
              className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4 transition hover:border-indigo-500/40"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg}`}
                >
                  <Icon
                    size={22}
                    className={colors.text}
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    {category.name}
                  </h3>

                  <p className="text-sm text-slate-400">
                    Total Spending
                  </p>
                </div>
              </div>

              <span className="text-lg font-bold text-white">
                ₹{category.amount.toLocaleString("en-IN")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TopCategories;