import React, { useState, useMemo } from "react";
import { useExpense } from "../hooks/useExpenses";
import Card from "../components/common/Card";
import { formatCurrency, formatDate } from "../utils/formatters";
import { Filter, Search, Trash2, TrendingDown, Calendar } from "lucide-react";

const CATEGORIES = [
  { id: "all", name: "All Categories", emoji: "📊", color: "#8B5CF6" },
  { id: "food", name: "Food & Dining", emoji: "🍕", color: "#F59E0B" },
  { id: "transport", name: "Transportation", emoji: "🚗", color: "#3B82F6" },
  { id: "shopping", name: "Shopping", emoji: "🛍️", color: "#EC4899" },
  { id: "entertainment", name: "Entertainment", emoji: "🎬", color: "#8B5CF6" },
  { id: "bills", name: "Bills & Utilities", emoji: "💡", color: "#10B981" },
  { id: "health", name: "Health", emoji: "💊", color: "#EF4444" },
  { id: "education", name: "Education", emoji: "📚", color: "#6366F1" },
  { id: "travel", name: "Travel", emoji: "✈️", color: "#06B6D4" },
  { id: "investment", name: "Investment", emoji: "📈", color: "#10B981" },
  { id: "others", name: "Others", emoji: "📦", color: "#6B7280" },
];

const Expenses = () => {
  const { transactions, removeTransaction } = useExpense();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Get available years and set up year selector state at the top level
  const availableYears = useMemo(() => {
    return [
      ...new Set(transactions.map((t) => new Date(t.date).getFullYear())),
    ].sort((a, b) => b - a);
  }, [transactions]);

  const [selectedYear, setSelectedYear] = useState(
    () => availableYears[0] || new Date().getFullYear(),
  );

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesCategory =
      selectedCategory === "all" || t.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  // Group by month, then by date
  const groupedByMonth = sortedTransactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date);
    const monthKey = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
    const dateKey = transaction.date;

    if (!groups[monthKey]) groups[monthKey] = {};
    if (!groups[monthKey][dateKey]) groups[monthKey][dateKey] = [];
    groups[monthKey][dateKey].push(transaction);
    return groups;
  }, {});

  const getCategoryInfo = (categoryId) => {
    return CATEGORIES.find((cat) => cat.id === categoryId) || CATEGORIES[10];
  };

  // Calculate top 3 categories for selected year
  const top3CategoriesData = useMemo(() => {
    const yearTransactions = transactions.filter((t) => {
      const transactionYear = new Date(t.date).getFullYear();
      return transactionYear === selectedYear && t.type === "expense";
    });

    if (yearTransactions.length === 0) return null;

    const categoryTotals = yearTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    const totalYearSpending = Object.values(categoryTotals).reduce(
      (a, b) => a + b,
      0,
    );

    const top3 = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([categoryId, amount]) => ({
        ...getCategoryInfo(categoryId),
        amount,
        percentage: (amount / totalYearSpending) * 100,
      }));

    return { top3, totalYearSpending };
  }, [transactions, selectedYear]);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Transactions
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Track and manage all your expenses & income
          </p>
        </div>

        {/* Top 3 Spending Categories - Yearly */}
        {top3CategoriesData && (
          <Card className="p-5 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 border-purple-500/10">
            {/* Header with Year Selector */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-300">
                  Top Spending Categories
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Total: {formatCurrency(top3CategoriesData.totalYearSpending)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <span className="text-lg">🏆</span>
                </div>

                {/* Year Selector */}
                {availableYears.length > 0 && (
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="px-3 py-1.5 bg-dark-bg border border-dark-border rounded-lg text-xs font-medium text-white focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                  >
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Top 3 Categories */}
            <div className="space-y-3">
              {top3CategoriesData.top3.map((category, index) => (
                <div key={category.id} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg transition-transform group-hover:scale-110"
                          style={{
                            backgroundColor: `${category.color}20`,
                            border: `1px solid ${category.color}40`,
                          }}
                        >
                          {category.emoji}
                        </div>
                        {/* Rank badge */}
                        <div
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            backgroundColor:
                              index === 0
                                ? "#FFD700"
                                : index === 1
                                  ? "#C0C0C0"
                                  : "#CD7F32",
                            color: "#000",
                          }}
                        >
                          {index + 1}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-white">
                          {category.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {category.percentage.toFixed(1)}% of total
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-base font-bold text-white">
                        {formatCurrency(category.amount)}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 bg-dark-bg rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${category.percentage}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search transactions..."
          className="w-full pl-12 pr-4 py-3.5 bg-dark-card rounded-2xl border-2 border-dark-border text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 scale-105"
                    : "bg-dark-card text-gray-400 hover:bg-dark-border hover:text-gray-300 border border-dark-border"
                }`}
              >
                <span className="text-base">{category.emoji}</span>
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {Object.keys(groupedByMonth).length === 0 ? (
        <Card className="p-12">
          <div className="text-center text-gray-400">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-dark-bg flex items-center justify-center">
              <Search size={32} className="text-gray-500" />
            </div>
            <p className="text-lg font-semibold text-gray-300 mb-1">
              No transactions found
            </p>
            <p className="text-sm">
              Try adjusting your filters or add a new transaction
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByMonth).map(([month, dates]) => {
            const monthTotal = Object.values(dates)
              .flat()
              .reduce(
                (sum, t) => sum + (t.type === "expense" ? t.amount : 0),
                0,
              );

            return (
              <div key={month} className="space-y-3">
                {/* Month Header */}
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-lg font-bold text-gray-300">{month}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">
                      Total:
                    </span>
                    <span className="text-sm text-red-400 font-bold px-3 py-1 rounded-full bg-red-500/10">
                      − {formatCurrency(monthTotal)}
                    </span>
                  </div>
                </div>

                {/* Dates */}
                <Card className="p-4 space-y-4">
                  {Object.entries(dates).map(([date, dayTransactions]) => (
                    <div key={date}>
                      {/* Date Header */}
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-dark-border/50">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                          {formatDate(date)}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {dayTransactions.length}{" "}
                          {dayTransactions.length === 1
                            ? "transaction"
                            : "transactions"}
                        </span>
                      </div>

                      {/* Transactions */}
                      <div className="space-y-2">
                        {dayTransactions.map((transaction) => {
                          const category = getCategoryInfo(
                            transaction.category,
                          );
                          const isIncome = transaction.type === "income";

                          return (
                            <div
                              key={transaction.id}
                              className="group relative flex items-center justify-between p-3 rounded-xl bg-dark-bg hover:bg-dark-border/50 transition-all border border-transparent hover:border-purple-500/20"
                            >
                              {/* Left Side */}
                              <div className="flex items-center gap-3 flex-1">
                                <div
                                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-lg"
                                  style={{
                                    backgroundColor: `${category.color}20`,
                                    border: `1px solid ${category.color}40`,
                                  }}
                                >
                                  {category.emoji}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-white truncate">
                                    {transaction.description || category.name}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {transaction.paymentMethod}
                                  </p>
                                </div>
                              </div>

                              {/* Right Side */}
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-sm font-bold px-3 py-1.5 rounded-lg ${
                                    isIncome
                                      ? "text-green-400 bg-green-500/10"
                                      : "text-red-400 bg-red-500/10"
                                  }`}
                                >
                                  {isIncome ? "+" : "−"}
                                  {formatCurrency(transaction.amount)}
                                </span>

                                <button
                                  onClick={() =>
                                    removeTransaction(transaction.id)
                                  }
                                  className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/20 transition-all"
                                  title="Delete transaction"
                                >
                                  <Trash2 size={16} className="text-red-400" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Expenses;
