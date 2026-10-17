import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { useMemo } from "react";
import Card, { CardHeader, CardTitle } from "../../components/ui/Card";
import { useTheme } from "../../context/ThemeContext";

function MonthlyOverviewChart({ transactions = [] }) {
  const { isDark } = useTheme();
  const chartData = useMemo(() => {
    const monthlyMap = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      if (isNaN(date.getTime())) return;

      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthLabel = date.toLocaleString("en-IN", {
        month: "short",
        year: "2-digit",
      });

      if (!monthlyMap[key]) {
        monthlyMap[key] = {
          key,
          month: monthLabel,
          income: 0,
          expense: 0,
        };
      }

      const amt = Number(transaction.amount) || 0;
      if (transaction.type === "income") {
        monthlyMap[key].income += amt;
      } else {
        monthlyMap[key].expense += amt;
      }
    });

    return Object.values(monthlyMap).sort((a, b) => a.key.localeCompare(b.key));
  }, [transactions]);

  const hasData = chartData.some((d) => d.income > 0 || d.expense > 0);

  return (
    <Card className="p-6">
      <CardHeader className="flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-5">
        <div>
          <CardTitle>Cash Flow Velocity & Trends</CardTitle>
          <p className="mt-1 text-xs text-[#66736E] dark:text-[#94A3B8]">
            Income trajectory versus recurring expenditure across calendar intervals.
          </p>
        </div>
      </CardHeader>

      <div className="h-80 w-full">
        {!hasData ? (
          <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#F8F7F0] dark:bg-[#0E172F] p-6 text-center">
            <p className="text-sm font-bold text-[#102A2A] dark:text-[#F8FAFC]">
              No Trend Data Recorded
            </p>
            <p className="mt-1 text-xs text-[#66736E] dark:text-[#94A3B8] max-w-xs">
              Log transactions over time to visualize velocity and cash flow trends.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="analyticsIncomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#087F68" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#087F68" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke={isDark ? "#1E2D4A" : "#E8E7DE"}
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                stroke={isDark ? "#94A3B8" : "#66736E"}
                tick={{ fill: isDark ? "#94A3B8" : "#66736E", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                stroke={isDark ? "#94A3B8" : "#66736E"}
                tick={{ fill: isDark ? "#94A3B8" : "#66736E", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => (val >= 1000 ? `₹${val / 1000}k` : `₹${val}`)}
              />

              <Tooltip
                formatter={(value, name) => [
                  `₹${Number(value).toLocaleString("en-IN")}`,
                  name === "income" ? "Total Income" : "Total Expense",
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

              <Legend
                wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }}
                formatter={(val) => (
                  <span className="text-[#102A2A] dark:text-[#F8FAFC] capitalize font-medium">
                    {val === "income" ? "Income (Credits)" : "Expense (Debits)"}
                  </span>
                )}
              />

              <Area
                type="monotone"
                dataKey="income"
                stroke="#087F68"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#analyticsIncomeGrad)"
              />

              <Line
                type="monotone"
                dataKey="expense"
                stroke="#D9573B"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#D9573B", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#D9573B", stroke: "#FFFDF8", strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}

export default MonthlyOverviewChart;