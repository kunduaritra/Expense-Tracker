import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "../common/Card";

const SpendingChart = ({ transactions }) => {
  // Group transactions by date
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const dayTransactions = transactions.filter(
      (t) => t.date === dateStr && t.type === "expense"
    );

    const total = dayTransactions.reduce((sum, t) => sum + t.amount, 0);

    last7Days.push({
      date: date.toLocaleDateString("en-US", { weekday: "short" }),
      amount: total,
    });
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">
        Spending Trend (Last 7 Days)
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={last7Days}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
          <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: "12px" }} />
          <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A1A1A",
              border: "1px solid #2D2D2D",
              borderRadius: "8px",
              color: "#FFFFFF",
            }}
            formatter={(value) => [`₹${value.toFixed(0)}`, "Spent"]}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="url(#gradient)"
            strokeWidth={3}
            dot={{ fill: "#8B5CF6", r: 4 }}
            activeDot={{ r: 6 }}
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SpendingChart;
