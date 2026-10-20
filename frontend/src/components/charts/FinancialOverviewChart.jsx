import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Line,
} from "recharts";
import Card, { CardHeader, CardTitle } from "../ui/Card";
import { useTheme } from "../../context/ThemeContext";

function FinancialOverviewChart({ data = [] }) {
  const { isDark } = useTheme();
  // Check if there are any non-zero values
  const hasData = data.some((d) => d.income > 0 || d.expense > 0);

  return (
    <Card className="p-5 sm:p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#E8E7DE] dark:border-[#1E2D4A]">
        <div>
          <CardTitle>Financial Overview</CardTitle>
          <p className="mt-0.5 text-xs text-[#66736E] dark:text-[#94A3B8]">
            Monthly cash flows comparison (Income vs Expense).
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#F8F7F0] dark:bg-[#0E172F] px-3 py-1.5 self-start sm:self-auto">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#087F68] dark:bg-[#00D09C]" />
            <span className="text-xs text-[#102A2A] dark:text-[#F8FAFC] font-medium">Income</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#D9573B] dark:bg-[#EF4444]" />
            <span className="text-xs text-[#102A2A] dark:text-[#F8FAFC] font-medium">Expense</span>
          </div>
        </div>
      </CardHeader>

      {/* Chart */}
      <div className="h-[280px] sm:h-[300px] w-full mt-4">
        {!hasData ? (
          <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#F8F7F0]/60 dark:bg-[#0E172F]/60 p-6 text-center">
            <p className="text-sm font-semibold text-[#102A2A] dark:text-[#F8FAFC]">
              No Cash Flow Activity Yet
            </p>
            <p className="mt-1 text-xs text-[#66736E] dark:text-[#94A3B8] max-w-xs">
              Monthly breakdown will dynamically map here as you record income deposits and expenditures.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#087F68" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#104E42" stopOpacity={0.5} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke={isDark ? "#1E2D4A" : "#E8E7DE"}
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tick={{ fill: isDark ? "#94A3B8" : "#66736E", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                tick={{ fill: isDark ? "#94A3B8" : "#66736E", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => (val >= 1000 ? `₹${val / 1000}k` : `₹${val}`)}
              />

              <Tooltip
                cursor={{ fill: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(16, 42, 42, 0.04)" }}
                formatter={(value, name) => [
                  `₹${Number(value).toLocaleString()}`,
                  name === "income" ? "Income" : "Expense",
                ]}
                contentStyle={{
                  background: isDark ? "#162447" : "#FFFDF8",
                  border: isDark ? "1px solid #1E2D4A" : "1px solid #E8E7DE",
                  borderRadius: "14px",
                  color: isDark ? "#F8FAFC" : "#102A2A",
                  boxShadow: isDark
                    ? "0 8px 24px rgba(0, 0, 0, 0.5)"
                    : "0 8px 24px rgba(16, 42, 42, 0.08)",
                  fontSize: "12px",
                }}
              />

              <Bar
                dataKey="income"
                fill="url(#incomeGradient)"
                radius={[6, 6, 0, 0]}
                barSize={20}
              />

              <Line
                type="monotone"
                dataKey="expense"
                stroke="#D9573B"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#D9573B", strokeWidth: 0 }}
                activeDot={{
                  r: 5,
                  fill: "#D9573B",
                  stroke: isDark ? "#111C38" : "#FFFDF8",
                  strokeWidth: 2,
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}

export default FinancialOverviewChart;