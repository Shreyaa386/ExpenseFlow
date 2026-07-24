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

import Card from "../ui/Card";

function FinancialOverviewChart({ data = [] }) {
  return (
    <Card className="rounded-3xl p-7">
      {/* Header */}

      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            Financial Overview
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Income vs Expense throughout the year
          </p>
        </div>

        <div className="flex items-center gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500"></span>

            <span className="text-sm text-slate-300">
              Income
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500"></span>

            <span className="text-sm text-slate-300">
              Expense
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}

      <div className="h-[360px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <ComposedChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: -15,
              bottom: 0,
            }}
          >
            <CartesianGrid
              stroke="#1E293B"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{
                fill: "#94A3B8",
                fontSize: 13,
              }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tick={{
                fill: "#94A3B8",
                fontSize: 13,
              }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              cursor={{
                fill: "rgba(148,163,184,0.05)",
              }}
              contentStyle={{
                background: "#0F172A",
                border: "1px solid #334155",
                borderRadius: "16px",
                color: "#fff",
              }}
            />

            <Bar
              dataKey="income"
              fill="#22C55E"
              radius={[8, 8, 0, 0]}
              barSize={26}
            />

            <Line
              type="monotone"
              dataKey="expense"
              stroke="#EF4444"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#EF4444",
                strokeWidth: 0,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default FinancialOverviewChart;