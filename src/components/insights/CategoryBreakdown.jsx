import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import Card from "../common/Card";

const CATEGORIES = [
  { id: "food", name: "Food & Dining", color: "#EF4444" },
  { id: "transport", name: "Transportation", color: "#F59E0B" },
  { id: "shopping", name: "Shopping", color: "#EC4899" },
  { id: "entertainment", name: "Entertainment", color: "#8B5CF6" },
  { id: "bills", name: "Bills & Utilities", color: "#3B82F6" },
  { id: "health", name: "Health", color: "#10B981" },
  { id: "education", name: "Education", color: "#6366F1" },
  { id: "travel", name: "Travel", color: "#06B6D4" },
  { id: "investment", name: "Investment", color: "#14B8A6" },
  { id: "others", name: "Others", color: "#64748B" },
];

const CategoryBreakdown = ({ transactions }) => {
  // Calculate category totals
  const categoryData = CATEGORIES.map((category) => {
    const total = transactions
      .filter((t) => t.category === category.id && t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      name: category.name,
      value: total,
      color: category.color,
    };
  }).filter((item) => item.value > 0);

  if (categoryData.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
        <div className="text-center py-8 text-gray-400">
          <p>No expense data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A1A1A",
              border: "1px solid #2D2D2D",
              borderRadius: "8px",
              color: "#FFFFFF",
            }}
            formatter={(value) => `₹${value.toFixed(0)}`}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span style={{ color: "#9CA3AF", fontSize: "12px" }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default CategoryBreakdown;
