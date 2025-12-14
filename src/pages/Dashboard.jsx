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

  // Load budget
  useEffect(() => {
    if (budget) {
      setBudgetInput(budget.toString());
    }
  }, [budget]);

  // Calculate stats
  const currentMonth = getMonthYear();
  const monthTransactions = transactions.filter((t) =>
    t.date.startsWith(currentMonth)
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Income"
          amount={totalIncome}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Total Expenses"
          amount={totalExpenses}
          icon={TrendingDown}
          color="red"
        />
        <StatsCard
          title="Savings"
          amount={savings}
          icon={Wallet}
          color="purple"
        />
      </div>

      {/* Budget Overview Card */}
      <Card gradient className="relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Monthly Budget</h3>
              <p className="text-sm text-gray-400">
                {formatCurrency(monthlyBudget - totalExpenses)} remaining
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{budgetUsed.toFixed(0)}%</p>
              <p className="text-sm text-gray-400">used</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-3 bg-dark-bg rounded-full overflow-hidden mb-4">
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

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">
              Spent: {formatCurrency(totalExpenses)}
            </span>
            <span className="text-gray-400">
              Budget: {formatCurrency(monthlyBudget)}
            </span>
          </div>
        </div>
      </Card>

      {/* Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">
            {new Date().toLocaleDateString("en-US", { month: "long" })} Expenses
            Breakdown
          </h3>
          <div className="space-y-3">
            {categoryBreakdown.map((category) => {
              const percentage = (category.amount / totalExpenses) * 100;

              return (
                <div key={category.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{category.emoji}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(category.amount)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
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
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowBudgetModal(false)}
          />
          <div className="relative bg-dark-card p-6 rounded-2xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Set Monthly Budget</h3>
            <p className="text-gray-400 mb-4">
              Set your monthly spending limit to track expenses better
            </p>

            <input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              placeholder="50000"
              className="w-full px-4 py-3 bg-dark-bg rounded-xl border border-dark-border text-white text-xl font-bold mb-4 focus:outline-none focus:border-purple-500"
              step="1000"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowBudgetModal(false)}
                className="flex-1 py-3 bg-dark-bg hover:bg-opacity-70 rounded-xl font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBudget}
                className="flex-1 py-3 gradient-primary rounded-xl font-medium transition-all hover:opacity-90"
              >
                Save Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
