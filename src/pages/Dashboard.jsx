import React, { useState } from "react";
import { useExpense } from "../hooks/useExpenses";
import StatsCard from "../components/dashboard/StatsCard";
import SpendingRing from "../components/dashboard/SpendingRing";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import AddExpenseModal from "../components/expense/AddExpenseModal";
import SMSParser from "../components/expense/SMSParser";
import {
  PlusCircle,
  TrendingUp,
  TrendingDown,
  Wallet,
  Upload,
} from "lucide-react";
import { getMonthYear } from "../utils/dateUtils";

const Dashboard = () => {
  const { transactions, addTransaction, removeTransaction } = useExpense();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSMSParser, setShowSMSParser] = useState(false);

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
  const monthlyBudget = 50000; // Default budget

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Track your finances at a glance</p>
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

      {/* Spending Ring */}
      <SpendingRing spent={totalExpenses} budget={monthlyBudget} />

      {/* Recent Transactions */}
      <RecentTransactions
        transactions={transactions}
        onDelete={removeTransaction}
      />

      {/* Floating Action Buttons - Positioned above bottom nav */}
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
      />
      <SMSParser
        isOpen={showSMSParser}
        onClose={() => setShowSMSParser(false)}
        onSubmit={addTransaction}
      />
    </div>
  );
};

export default Dashboard;
