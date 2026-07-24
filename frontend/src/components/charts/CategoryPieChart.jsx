import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import Card from "../ui/Card";

const COLORS = [
  "#22C55E",
  "#3B82F6",
  "#F97316",
  "#A855F7",
  "#EF4444",
  "#EAB308",
  "#14B8A6",
];

function CategoryPieChart({ data = [] }) {
  return (
    <Card className="rounded-3xl p-7">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white">
          Expense by Category
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Distribution of your expenses
        </p>
      </div>

      <div className="grid items-center gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Pie Chart */}

        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                innerRadius={70}
                outerRadius={105}
                paddingAngle={3}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [`₹${value}`, "Amount"]}
                contentStyle={{
                  background: "#0F172A",
                  border: "1px solid #334155",
                  borderRadius: "14px",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}

        <div className="space-y-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3.5 w-3.5 rounded-full"
                  style={{
                    backgroundColor:
                      COLORS[index % COLORS.length],
                  }}
                />

                <span className="text-sm font-medium text-slate-300">
                  {item.category}
                </span>
              </div>

              <span className="text-sm font-semibold text-white">
                ₹{item.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default CategoryPieChart;