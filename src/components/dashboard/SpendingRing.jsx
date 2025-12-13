import React from "react";
import Card from "../common/Card";
import { formatCurrency } from "../../utils/formatters";

const SpendingRing = ({ spent, budget }) => {
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  const remaining = budget - spent;
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card gradient className="flex flex-col items-center justify-center py-8">
      <div className="relative w-48 h-48">
        <svg className="transform -rotate-90 w-48 h-48">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r="70"
            stroke="rgba(139, 92, 246, 0.1)"
            strokeWidth="12"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="96"
            cy="96"
            r="70"
            stroke="url(#gradient)"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-400">Remaining</p>
          <p className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            {formatCurrency(remaining > 0 ? remaining : 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {percentage.toFixed(0)}% used
          </p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">Monthly Budget</p>
        <p className="text-xl font-semibold">{formatCurrency(budget)}</p>
      </div>
    </Card>
  );
};

export default SpendingRing;
