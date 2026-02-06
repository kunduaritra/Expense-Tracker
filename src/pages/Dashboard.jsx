import React, { useState, useEffect } from "react";
import { useExpense } from "../hooks/useExpenses";
import { useAuth } from "../hooks/useAuth";
import StatsCard from "../components/dashboard/StatsCard";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import AddExpenseModal from "../components/expense/AddExpenseModal";
import SMSParser from "../components/expense/SMSParser";
import Card from "../components/common/Card";
import {
  PlusCircle,
  TrendingUp,
  TrendingDown,
  Wallet,
  Upload,
  Settings,
} from "lucide-react";
import { getMonthYear } from "../utils/dateUtils";
import { formatCurrency } from "../utils/formatters";
import { EXPENSE_CATEGORIES } from "../utils/constants";

const Dashboard = () => {
  const { user } = useAuth();
  const {
    transactions,
    addTransaction,
    removeTransaction,
    cards,
    budget,
    updateBudget,
  } = useExpense();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSMSParser, setShowSMSParser] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetInput, setBudgetInput] = useState("50000");
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Load budget
  useEffect(() => {
    if (budget) {
      setBudgetInput(budget.toString());
    }
  }, [budget]);

  // Calculate stats
  const currentMonth = getMonthYear();
  const monthTransactions = transactions.filter((t) =>
    t.date.startsWith(currentMonth),
  );

  const totalIncome = monthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = monthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const savings = totalIncome - totalExpenses;
  const monthlyBudget = budget || 50000;
  const budgetUsed = (totalExpenses / monthlyBudget) * 100;

  // Category-wise breakdown
  const categoryBreakdown = EXPENSE_CATEGORIES.map((category) => {
    const total = monthTransactions
      .filter((t) => t.category === category.id && t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      ...category,
      amount: total,
    };
  })
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const handleSaveBudget = async () => {
    const amount = parseFloat(budgetInput);
    if (amount > 0) {
      await updateBudget(amount);
      setShowBudgetModal(false);
    }
  };

  const topCategories = categoryBreakdown.slice(0, 3);

  const othersAmount = categoryBreakdown
    .slice(3)
    .reduce((sum, c) => sum + c.amount, 0);

  const collapsedCategories = [
    ...topCategories,
    ...(othersAmount > 0
      ? [
          {
            id: "others",
            name: "Others",
            emoji: "📦",
            color: "#64748B",
            amount: othersAmount,
          },
        ]
      : []),
  ];

  const visibleCategories = showAllCategories
    ? categoryBreakdown
    : collapsedCategories;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.displayName?.split(" ")[0] || "User"}! 👋
          </h1>
          <p className="text-gray-400">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={() => setShowBudgetModal(true)}
          className="p-3 bg-dark-card hover:bg-opacity-70 rounded-xl transition-all"
          title="Set Monthly Budget"
        >
          <Settings size={24} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatsCard
          title="Total Income"
          amount={totalIncome}
          icon={TrendingUp}
          type="income"
        />

        <StatsCard
          title="Total Expenses"
          amount={totalExpenses}
          icon={TrendingDown}
          type="expense"
        />
        <StatsCard
          title="Savings"
          amount={savings}
          icon={Wallet}
          type={savings >= 0 ? "income" : "expense"}
        />
      </div>

      {/* Budget Overview Card */}
      <Card>
        {/* Top */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-gray-400 mb-1">Remaining Budget</p>
            <p className="text-3xl font-bold font-mono">
              {formatCurrency(monthlyBudget - totalExpenses)}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              budgetUsed >= 90
                ? "bg-red-500/15 text-red-400"
                : budgetUsed >= 70
                  ? "bg-orange-500/15 text-orange-400"
                  : "bg-green-500/15 text-green-400"
            }`}
          >
            {budgetUsed.toFixed(0)}% Used
          </span>
        </div>

        {/* Progress */}
        <div className="h-2 bg-dark-bg rounded-full overflow-hidden mb-3">
          <div
            className={`h-full transition-all duration-500 ${
              budgetUsed >= 90
                ? "bg-red-500"
                : budgetUsed >= 70
                  ? "bg-orange-500"
                  : "gradient-primary"
            }`}
            style={{ width: `${Math.min(budgetUsed, 100)}%` }}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-between text-xs text-gray-400">
          <span>Spent: {formatCurrency(totalExpenses)}</span>
          <span>Budget: {formatCurrency(monthlyBudget)}</span>
        </div>
      </Card>

      {/* Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">
              {new Date().toLocaleDateString("en-US", { month: "long" })}{" "}
              Spending
            </h3>

            {categoryBreakdown.length > 2 && (
              <div className="flex justify-center pt-3">
                <button
                  onClick={() => setShowAllCategories((prev) => !prev)}
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-all duration-200"
                >
                  <span
                    className={`text-purple-400 transition-transform duration-200 ${showAllCategories ? "rotate-180" : ""}`}
                  >
                    ▼
                  </span>
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3 transition-all">
            {visibleCategories.map((category) => {
              const percentage = (category.amount / totalExpenses) * 100;

              return (
                <div key={category.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.emoji}</span>
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {formatCurrency(category.amount)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Recent Transactions */}
      <RecentTransactions
        transactions={transactions}
        onDelete={removeTransaction}
      />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-24 right-6 flex flex-col gap-3 z-40">
        <button
          onClick={() => setShowSMSParser(true)}
          className="w-14 h-14 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
          title="Parse SMS"
        >
          <Upload size={24} className="text-white" />
        </button>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
          title="Add Transaction"
        >
          <PlusCircle size={28} className="text-white" />
        </button>
      </div>

      {/* Modals */}
      <AddExpenseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={addTransaction}
        savedCards={cards}
      />
      <SMSParser
        isOpen={showSMSParser}
        onClose={() => setShowSMSParser(false)}
        onSubmit={addTransaction}
      />

      {/* Budget Settings Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setShowBudgetModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-gradient-to-br from-dark-card to-dark-card/95 p-8 rounded-3xl max-w-md w-full shadow-2xl border border-purple-500/10 animate-modalSlideIn">
            {/* Close button */}
            <button
              onClick={() => setShowBudgetModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-dark-bg/50 hover:bg-dark-bg transition-colors text-gray-400 hover:text-white"
            >
              ✕
            </button>

            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/20">
              <span className="text-3xl">💰</span>
            </div>

            {/* Header */}
            <h3 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Set Monthly Budget
            </h3>
            <p className="text-gray-400 text-center text-sm mb-6">
              Define your spending limit to stay on track
            </p>

            {/* Input with currency symbol */}
            <div className="relative mb-6">
              <span className="absolute left-4 top-4 text-2xl font-bold text-purple-400">
                ₹
              </span>
              <input
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                placeholder="50,000"
                className="w-full pl-12 pr-4 py-4 bg-dark-bg/50 rounded-2xl border-2 border-dark-border text-white text-2xl font-bold placeholder:text-gray-600 focus:outline-none focus:border-purple-500 focus:bg-dark-bg transition-all"
                step="1000"
                autoFocus
              />

              {/* Quick amount buttons */}
              <div className="flex gap-2 mt-3">
                {[10000, 25000, 50000, 100000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBudgetInput(amount.toString())}
                    className="flex-1 px-2 py-1.5 text-xs font-medium bg-dark-bg/50 hover:bg-purple-500/20 border border-dark-border hover:border-purple-500/30 rounded-lg transition-all text-gray-400 hover:text-purple-400"
                  >
                    {(amount / 1000).toFixed(0)}K
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowBudgetModal(false)}
                className="flex-1 py-3.5 bg-dark-bg/80 hover:bg-dark-bg rounded-xl font-semibold transition-all text-gray-300 hover:text-white border border-dark-border hover:border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBudget}
                className="flex-1 py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                Save Budget
              </button>
            </div>

            {/* Optional: Current budget indicator */}
            {budget > 0 && (
              <p className="text-center text-xs text-gray-500 mt-4">
                Current budget: {formatCurrency(budget)}
              </p>
            )}
          </div>

          {/* Add animation styles */}
          <style jsx>{`
            @keyframes modalSlideIn {
              from {
                opacity: 0;
                transform: scale(0.95) translateY(10px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }

            .animate-modalSlideIn {
              animation: modalSlideIn 0.2s ease-out;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
