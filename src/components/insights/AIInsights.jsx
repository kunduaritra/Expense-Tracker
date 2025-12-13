import React from "react";
import Card from "../common/Card";
import { Sparkles, TrendingUp, AlertCircle, Lightbulb } from "lucide-react";

const AIInsights = ({ transactions, budget }) => {
  const generateInsights = () => {
    const insights = [];

    // Calculate current month expenses
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthExpenses = transactions
      .filter((t) => t.date.startsWith(currentMonth) && t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    // Budget check
    if (budget && monthExpenses > budget * 0.8) {
      insights.push({
        type: "warning",
        icon: AlertCircle,
        title: "Budget Alert",
        message: `You've used ${((monthExpenses / budget) * 100).toFixed(
          0
        )}% of your monthly budget`,
        color: "text-orange-400",
      });
    }

    // Calculate daily average
    const daysInMonth = new Date().getDate();
    const avgDaily = monthExpenses / daysInMonth;

    insights.push({
      type: "info",
      icon: TrendingUp,
      title: "Daily Average",
      message: `Your average daily spending is ₹${avgDaily.toFixed(0)}`,
      color: "text-blue-400",
    });

    // Find top category
    const categoryTotals = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryTotals[t.category] =
          (categoryTotals[t.category] || 0) + t.amount;
      });

    const topCategory = Object.entries(categoryTotals).sort(
      ([, a], [, b]) => b - a
    )[0];

    if (topCategory) {
      insights.push({
        type: "tip",
        icon: Lightbulb,
        title: "Top Spending Category",
        message: `Most of your spending is on ${
          topCategory[0].charAt(0).toUpperCase() + topCategory[0].slice(1)
        }`,
        color: "text-purple-400",
      });
    }

    // Savings suggestion
    const potentialSavings = monthExpenses * 0.1;
    insights.push({
      type: "tip",
      icon: Sparkles,
      title: "Savings Opportunity",
      message: `You could save ₹${potentialSavings.toFixed(
        0
      )} by reducing non-essential expenses by 10%`,
      color: "text-green-400",
    });

    return insights;
  };

  const insights = generateInsights();

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-purple-400" size={20} />
        <h3 className="text-lg font-semibold">AI Insights</h3>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="p-4 bg-dark-bg rounded-xl flex items-start gap-3"
          >
            <insight.icon className={insight.color} size={20} />
            <div className="flex-1">
              <h4 className="font-medium mb-1">{insight.title}</h4>
              <p className="text-sm text-gray-400">{insight.message}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AIInsights;
