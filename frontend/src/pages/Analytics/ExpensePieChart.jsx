import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card, { CardHeader, CardTitle } from "../../components/ui/Card";
import { useTheme } from "../../context/ThemeContext";

const COLORS = [
  "#087F68", // Teal/forest
  "#D99016", // Mustard gold
  "#104E42", // Deep forest
  "#3F8F46", // Leaf green
  "#D9573B", // Terracotta
  "#E69A20", // Warm amber
  "#546A63", // Slate green
  "#8C7B5D", // Warm khaki
];

function ExpensePieChart({ transactions = [] }) {
  const { isDark } = useTheme();
  const { chartData, totalExpense } = useMemo(() => {
    const categoryMap = {};
    let total = 0;

    transactions.forEach((transaction) => {
      if (transaction.type !== "expense") return;

      const category = transaction.category || "Other";
      const amt = Number(transaction.amount) || 0;
      categoryMap[category] = (categoryMap[category] || 0) + amt;
      total += amt;
    });

    const data = Object.entries(categoryMap)
      .map(([name, value]) => ({
        name,
        value,
        percentage: total > 0 ? Math.round((value / total) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value);

    return { chartData: data, totalExpense: total };
  }, [transactions]);

  const hasData = chartData.length > 0 && totalExpense > 0;

  return (
    <Card className="p-6">
      <CardHeader className="flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4">
        <div>
          <CardTitle>Expense Distribution</CardTitle>
          <p className="mt-1 text-xs text-[#66736E] dark:text-[#94A3B8]">
            Outflow proportion breakdown by spending classification.
          </p>
        </div>
      </CardHeader>

      {!hasData ? (
        <div className="flex h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#F8F7F0] dark:bg-[#0E172F] p-6 text-center">
          <p className="text-sm font-bold text-[#102A2A] dark:text-[#F8FAFC]">
            No Outflow Records
          </p>
          <p className="mt-1 text-xs text-[#66736E] dark:text-[#94A3B8] max-w-xs">
            No expense records exist within the selected timeframe.
          </p>
        </div>
      ) : (
        <div className="grid items-center gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={105}
                  innerRadius={68}
                  paddingAngle={3}
                  stroke={isDark ? "#111C38" : "#FFFDF8"}
                  strokeWidth={2}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [
                    `₹${Number(value).toLocaleString("en-IN")}`,
                    name,
                  ]}
                  contentStyle={{
                    background: isDark ? "#162447" : "#FFFDF8",
                    border: isDark ? "1px solid #1E2D4A" : "1px solid #E8E7DE",
                    borderRadius: "14px",
                    color: isDark ? "#F8FAFC" : "#102A2A",
                    fontSize: "12px",
                    boxShadow: isDark
                      ? "0 4px 20px rgba(0,0,0,0.5)"
                      : "0 4px 16px -4px rgba(16,42,42,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {chartData.map((item, index) => {
              const color = COLORS[index % COLORS.length];

              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#F8F7F0] dark:bg-[#0E172F] px-3.5 py-2.5 transition hover:border-[#D5D3C8] dark:hover:border-[#2E4369]"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="truncate text-xs font-semibold text-[#102A2A] dark:text-[#F8FAFC]">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-[#102A2A] dark:text-[#F8FAFC] font-mono">
                      ₹{item.value.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#66736E] dark:text-[#94A3B8] font-mono">
                      ({item.percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}

export default ExpensePieChart;