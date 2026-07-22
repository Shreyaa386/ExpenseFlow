import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Card from "../ui/Card";

const data = [
  { month: "Jan", expense: 12000 },
  { month: "Feb", expense: 18000 },
  { month: "Mar", expense: 14000 },
  { month: "Apr", expense: 22000 },
  { month: "May", expense: 17000 },
  { month: "Jun", expense: 25000 },
  { month: "Jul", expense: 21000 },
];

function ExpenseChart() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">
          Monthly Expense
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Expense trend over the last 7 months
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="expenseGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#6366F1"
                  stopOpacity={0.7}
                />

                <stop
                  offset="100%"
                  stopColor="#6366F1"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#334155"
            />

            <XAxis
              dataKey="month"
              stroke="#94A3B8"
            />

            <YAxis
              stroke="#94A3B8"
            />

            <Tooltip
              contentStyle={{
                background: "#0F172A",
                border: "1px solid #334155",
                borderRadius: "12px",
                color: "#fff",
              }}
            />

            <Area
              type="monotone"
              dataKey="expense"
              stroke="#6366F1"
              strokeWidth={3}
              fill="url(#expenseGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default ExpenseChart;