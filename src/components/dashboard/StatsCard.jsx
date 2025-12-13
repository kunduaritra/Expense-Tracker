import React from "react";
import Card from "../common/Card";
import { formatCurrency } from "../../utils/formatters";

const StatsCard = ({ title, amount, icon: Icon, trend, color = "purple" }) => {
  const colors = {
    purple: "text-purple-500",
    pink: "text-pink-500",
    green: "text-green-500",
    red: "text-red-500",
    blue: "text-blue-500",
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{formatCurrency(amount)}</h3>
          {trend && (
            <p
              className={`text-sm mt-2 ${
                trend > 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {trend > 0 ? "+" : ""}
              {trend}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-opacity-10 ${colors[color]}`}>
          <Icon className={colors[color]} size={24} />
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
