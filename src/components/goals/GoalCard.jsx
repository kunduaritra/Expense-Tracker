import React from "react";
import Card from "../common/Card";
import { formatCurrency } from "../../utils/formatters";
import { Target, TrendingUp } from "lucide-react";

const GoalCard = ({ goal, onContribute }) => {
  const progress =
    goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;

  const remaining = goal.targetAmount - goal.currentAmount;
  const daysLeft = Math.ceil(
    (new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Target className="text-white" size={24} />
          </div>
          <div>
            <h3 className="font-semibold">{goal.title}</h3>
            <p className="text-sm text-gray-400">{daysLeft} days left</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Progress</span>
          <span className="font-semibold">{progress.toFixed(0)}%</span>
        </div>
        <div className="h-3 bg-dark-bg rounded-full overflow-hidden">
          <div
            className="h-full gradient-primary transition-all duration-500 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Amount Info */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm text-gray-400">Saved</p>
          <p className="text-xl font-bold">
            {formatCurrency(goal.currentAmount)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Target</p>
          <p className="text-lg font-semibold">
            {formatCurrency(goal.targetAmount)}
          </p>
        </div>
      </div>

      {remaining > 0 && (
        <div className="mt-4 p-3 bg-purple-500/10 rounded-xl">
          <p className="text-sm text-purple-400">
            {formatCurrency(remaining)} remaining to reach your goal
          </p>
        </div>
      )}

      {onContribute && (
        <button
          onClick={() => onContribute(goal)}
          className="mt-4 w-full py-2 bg-dark-bg hover:bg-opacity-70 rounded-lg text-sm font-medium transition-all"
        >
          Add Contribution
        </button>
      )}
    </Card>
  );
};

export default GoalCard;
