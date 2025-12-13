import React from "react";
import { useExpense } from "../hooks/useExpenses";
import SpendingChart from "../components/insights/SpendingChart";
import CategoryBreakdown from "../components/insights/CategoryBreakdown";
import AIInsights from "../components/insights/AIInsights";
import { Sparkles } from "lucide-react";

const Insights = () => {
  const { transactions } = useExpense();
  const monthlyBudget = 50000; // Default budget

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="text-purple-400" />
          Insights
        </h1>
        <p className="text-gray-400">Understand your spending patterns</p>
      </div>

      {/* AI Insights */}
      <AIInsights transactions={transactions} budget={monthlyBudget} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart transactions={transactions} />
        <CategoryBreakdown transactions={transactions} />
      </div>
    </div>
  );
};

export default Insights;
