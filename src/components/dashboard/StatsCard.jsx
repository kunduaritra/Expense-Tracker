import React from "react";
import { formatCurrency } from "../../utils/formatters";

const StatsCard = ({ title, amount, icon: Icon, type }) => {
  const colorMap = {
    income: "text-green-500",
    expense: "text-red-500",
    neutral: "text-purple-400",
  };

  return (
    <div className="bg-dark-card rounded-xl p-4 flex items-center gap-4">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center bg-dark-bg ${colorMap[type]}`}
      >
        <Icon size={20} />
      </div>

      <div className="flex-1">
        <p className="text-xs text-gray-400">{title}</p>
        <p
          className={`text-lg font-semibold font-mono leading-tight ${colorMap[type]}`}
        >
          {formatCurrency(amount)}
        </p>
      </div>
    </div>
  );
};

export default React.memo(StatsCard);
