import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card, { CardHeader, CardTitle } from "../ui/Card";
import { PieChart as PieIcon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const FINTECH_COLORS = [
  "#087F68", // Teal Accent
  "#D99016", // Mustard Accent
  "#104E42", // Forest
  "#3F8F46", // Success
  "#D9573B", // Danger / Terracotta
  "#E69A20", // Warning
  "#176453", // Forest Secondary
  "#66736E", // Sage Slate
];

function CategoryPieChart({ data = [] }) {
  const { isDark } = useTheme();
  const totalAmount = data.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const hasData = data.length > 0 && totalAmount > 0;

  return (
    <Card className="p-5 sm:p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <CardHeader className="pb-4 border-b border-[#E8E7DE] dark:border-[#1E2D4A]">
        <div>
          <CardTitle>Expense by Category</CardTitle>
          <p className="mt-0.5 text-xs text-[#66736E] dark:text-[#94A3B8]">
            Real allocation across your spending categories.
          </p>
        </div>
      </CardHeader>

      {!hasData ? (
        <div className="flex h-[280px] sm:h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#F8F7F0]/60 dark:bg-[#0E172F]/60 p-6 text-center mt-4">
          <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#087F68]/10 dark:bg-[#00D09C]/15 text-[#087F68] dark:text-[#00D09C] border border-[#087F68]/20 dark:border-[#00D09C]/30">
            <PieIcon size={20} />
          </div>
          <p className="text-sm font-semibold text-[#102A2A] dark:text-[#F8FAFC]">
            No Expense Categories Yet
          </p>
          <p className="mt-1 text-xs text-[#66736E] dark:text-[#94A3B8] max-w-xs">
            As you log expenses with category tags, your spending distribution will automatically render here.
          </p>
        </div>
      ) : (
        <div className="grid items-center gap-6 lg:grid-cols-[1.2fr_1fr] mt-4">
          {/* Pie / Donut Chart */}
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  stroke={isDark ? "#111C38" : "#FFFDF8"}
                  strokeWidth={2}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={FINTECH_COLORS[index % FINTECH_COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString()}`,
                    "Amount",
                  ]}
                  contentStyle={{
                    background: isDark ? "#162447" : "#FFFDF8",
                    border: isDark ? "1px solid #1E2D4A" : "1px solid #E8E7DE",
                    borderRadius: "14px",
                    color: isDark ? "#F8FAFC" : "#102A2A",
                    fontSize: "12px",
                    boxShadow: isDark
                      ? "0 8px 24px rgba(0, 0, 0, 0.5)"
                      : "0 8px 24px rgba(16, 42, 42, 0.08)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown Legend */}
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {data.map((item, index) => {
              const color = FINTECH_COLORS[index % FINTECH_COLORS.length];
              const percentage =
                totalAmount > 0
                  ? Math.round((Number(item.amount) / totalAmount) * 100)
                  : 0;

              return (
                <div
                  key={item.category || index}
                  className="flex items-center justify-between rounded-xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#F8F7F0] dark:bg-[#0E172F] px-3.5 py-2.5 transition hover:border-[#D5D3C8] dark:hover:border-[#2E4369]"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="truncate text-xs sm:text-[13px] font-semibold text-[#102A2A] dark:text-[#F8FAFC]">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-xs sm:text-sm font-bold text-[#102A2A] dark:text-[#F8FAFC] font-mono">
                      ₹{Number(item.amount).toLocaleString()}
                    </span>
                    <span className="text-xs text-[#66736E] dark:text-[#94A3B8] font-mono font-medium">
                      ({percentage}%)
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

export default CategoryPieChart;