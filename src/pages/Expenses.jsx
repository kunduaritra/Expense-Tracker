import React, { useState, useMemo } from "react";
import { useExpense } from "../hooks/useExpenses";
import Card from "../components/common/Card";
import BottomSheet from "../components/common/BottomSheet";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import CategoryPicker from "../components/expense/CategoryPicker";
import { formatCurrency, formatDate } from "../utils/formatters";
import {
  Search,
  Trash2,
  Edit2,
  IndianRupee,
  Calendar,
  FileText,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";

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
  { id: "personal-care", name: "Personal Care", emoji: "🧴", color: "#F43F5E" },
  { id: "fitness", name: "Gym & Fitness", emoji: "🏋️", color: "#22C55E" },
  { id: "gifts", name: "Gifts & Donations", emoji: "🎁", color: "#E11D48" },
  { id: "family", name: "Family Expenses", emoji: "👨‍👩‍👧‍👦", color: "#9333EA" },
  { id: "rent", name: "Rent", emoji: "🏠", color: "#A855F7" },
  { id: "emi", name: "EMI / Loans", emoji: "💳", color: "#DC2626" },
  { id: "insurance", name: "Insurance", emoji: "🛡️", color: "#0EA5E9" },
  { id: "tax", name: "Taxes", emoji: "🧾", color: "#F97316" },
  { id: "subscriptions", name: "Subscriptions", emoji: "📺", color: "#7C3AED" },
  { id: "others", name: "Others", emoji: "📦", color: "#6B7280" },
];

const PAYMENT_METHODS = ["Cash", "UPI", "Card", "Credit Card", "Net Banking"];

// ── Quick filter presets ──
const QUICK_FILTERS = [
  { id: "all_time", label: "All Time" },
  { id: "this_month", label: "This Month" },
  { id: "last_month", label: "Last Month" },
  { id: "this_week", label: "This Week" },
  { id: "custom", label: "Custom Range" },
];

const getQuickFilterRange = (filterId) => {
  const now = new Date();
  switch (filterId) {
    case "this_week": {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      return {
        from: start.toISOString().slice(0, 10),
        to: end.toISOString().slice(0, 10),
      };
    }
    case "this_month": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return {
        from: start.toISOString().slice(0, 10),
        to: end.toISOString().slice(0, 10),
      };
    }
    case "last_month": {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return {
        from: start.toISOString().slice(0, 10),
        to: end.toISOString().slice(0, 10),
      };
    }
    default:
      return { from: "", to: "" };
  }
};

// Transaction Row Component with Edit
const TransactionRow = ({
  transaction,
  category,
  onDelete,
  onEdit,
  accounts,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const isIncome = transaction.type === "income";
  const description = transaction.description || category.name;
  const maxLength = 30;
  const needsTruncate = description.length > maxLength;
  const account = accounts?.find((a) => a.id === transaction.accountId);

  return (
    <div className="group relative flex items-start gap-3 p-3 rounded-xl bg-dark-bg hover:bg-dark-border/50 transition-all border border-transparent hover:border-purple-500/20">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg flex-shrink-0"
        style={{
          backgroundColor: `${category.color}20`,
          border: `1px solid ${category.color}40`,
        }}
      >
        {category.emoji}
      </div>

      <div className="flex-1 min-w-0">
        <div className="space-y-0.5">
          {needsTruncate && !showFullDescription ? (
            <p className="text-sm font-semibold text-white leading-tight">
              {description.substring(0, maxLength)}...
              <button
                onClick={() => setShowFullDescription(true)}
                className="ml-1 text-xs text-purple-400 hover:text-purple-300 font-medium"
              >
                more
              </button>
            </p>
          ) : (
            <div>
              <p className="text-sm font-semibold text-white break-words leading-tight">
                {description}
              </p>
              {needsTruncate && showFullDescription && (
                <button
                  onClick={() => setShowFullDescription(false)}
                  className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                >
                  show less
                </button>
              )}
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span>{transaction.paymentMethod}</span>
            {account && (
              <>
                <span>•</span>
                <span className="truncate">{account.bankName}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-all flex-shrink-0">
        <button
          onClick={() => onEdit(transaction)}
          className="p-1.5 rounded-lg hover:bg-blue-500/20 transition-all"
          title="Edit transaction"
        >
          <Edit2 size={14} className="text-blue-400" />
        </button>
        <button
          onClick={() => onDelete(transaction.id)}
          className="p-1.5 rounded-lg hover:bg-red-500/20 transition-all"
          title="Delete transaction"
        >
          <Trash2 size={14} className="text-red-400" />
        </button>
      </div>

      <span
        className={`text-sm font-bold px-2.5 py-1 rounded-lg whitespace-nowrap flex-shrink-0 ${isIncome ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"}`}
      >
        {isIncome ? "+" : "−"}
        {formatCurrency(transaction.amount)}
      </span>
    </div>
  );
};

// ── Date Filter Panel ──
const DateFilterPanel = ({
  activeQuick,
  onQuickSelect,
  fromDate,
  toDate,
  onFromChange,
  onToChange,
  onClear,
  hasActiveFilter,
}) => {
  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-4 space-y-4">
      {/* Quick filter chips */}
      <div>
        <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wider">
          Quick Filters
        </p>
        <div className="flex flex-wrap gap-2">
          {QUICK_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => onQuickSelect(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeQuick === f.id
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                  : "bg-dark-bg text-gray-400 hover:text-white border border-dark-border"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom date range - shown when custom is selected */}
      {activeQuick === "custom" && (
        <div>
          <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wider">
            Date Range
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => onFromChange(e.target.value)}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => onToChange(e.target.value)}
                min={fromDate}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {/* Clear filter */}
      {hasActiveFilter && (
        <button
          onClick={onClear}
          className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors"
        >
          <X size={12} /> Clear date filter
        </button>
      )}
    </div>
  );
};

const Expenses = () => {
  const {
    transactions,
    removeTransaction,
    updateTransaction,
    accounts,
    expenseCategories,
    incomeCategories,
  } = useExpense();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editForm, setEditForm] = useState({
    amount: "",
    category: "",
    date: "",
    description: "",
    paymentMethod: "UPI",
    type: "expense",
    accountId: null,
  });
  const [errors, setErrors] = useState({});

  // ── Date filter state ──
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState("all_time");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const availableYears = useMemo(() => {
    return [
      ...new Set(transactions.map((t) => new Date(t.date).getFullYear())),
    ].sort((a, b) => b - a);
  }, [transactions]);

  const [selectedYear, setSelectedYear] = useState(
    () => availableYears[0] || new Date().getFullYear(),
  );

  // Compute active date range from quick filter or custom
  const activeDateRange = useMemo(() => {
    if (activeQuickFilter === "all_time") return { from: "", to: "" };
    if (activeQuickFilter === "custom")
      return { from: customFrom, to: customTo };
    return getQuickFilterRange(activeQuickFilter);
  }, [activeQuickFilter, customFrom, customTo]);

  const hasActiveFilter = activeQuickFilter !== "all_time";

  const handleQuickSelect = (filterId) => {
    setActiveQuickFilter(filterId);
    if (filterId !== "custom") {
      setCustomFrom("");
      setCustomTo("");
    }
  };

  const handleClearFilter = () => {
    setActiveQuickFilter("all_time");
    setCustomFrom("");
    setCustomTo("");
  };

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesCategory =
        selectedCategory === "all" || t.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesDate = true;
      if (activeDateRange.from) {
        matchesDate = matchesDate && t.date >= activeDateRange.from;
      }
      if (activeDateRange.to) {
        matchesDate = matchesDate && t.date <= activeDateRange.to;
      }

      return matchesCategory && matchesSearch && matchesDate;
    });
  }, [transactions, selectedCategory, searchQuery, activeDateRange]);

  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

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

  const getCategoryInfo = (categoryId) =>
    CATEGORIES.find((cat) => cat.id === categoryId) || CATEGORIES[10];

  // Top 3 categories
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

  // Handle Edit
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setEditForm({
      amount: transaction.amount.toString(),
      category: transaction.category,
      date: transaction.date,
      description: transaction.description || "",
      paymentMethod: transaction.paymentMethod,
      type: transaction.type,
      accountId: transaction.accountId || null,
    });
    setErrors({});
    setShowEditModal(true);
  };

  const handleUpdateTransaction = async () => {
    const newErrors = {};
    if (!editForm.amount || editForm.amount <= 0)
      newErrors.amount = "Please enter a valid amount";
    if (!editForm.category) newErrors.category = "Please select a category";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      await updateTransaction(editingTransaction.id, {
        ...editForm,
        amount: parseFloat(editForm.amount),
      });
      setShowEditModal(false);
      setEditingTransaction(null);
    } catch (error) {
      alert("Failed to update transaction");
    }
  };

  // Active filter label for badge
  const activeFilterLabel = useMemo(() => {
    if (activeQuickFilter === "all_time") return null;
    if (activeQuickFilter === "custom") {
      if (customFrom && customTo) return `${customFrom} → ${customTo}`;
      if (customFrom) return `From ${customFrom}`;
      if (customTo) return `Until ${customTo}`;
      return "Custom";
    }
    return QUICK_FILTERS.find((f) => f.id === activeQuickFilter)?.label || null;
  }, [activeQuickFilter, customFrom, customTo]);

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

        {/* Top 3 Categories */}
        {top3CategoriesData && (
          <Card className="p-5 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 border-purple-500/10">
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

      {/* Search + Filter Button Row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
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

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowDateFilter((prev) => !prev)}
          className={`relative flex items-center gap-2 px-4 py-3.5 rounded-2xl border-2 font-medium text-sm transition-all flex-shrink-0 ${
            showDateFilter || hasActiveFilter
              ? "bg-purple-500/10 border-purple-500 text-purple-400"
              : "bg-dark-card border-dark-border text-gray-400 hover:border-gray-600 hover:text-white"
          }`}
        >
          <SlidersHorizontal size={18} />
          <span className="hidden sm:inline">Filter</span>
          {/* Badge when filter is active */}
          {hasActiveFilter && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-purple-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
              ✓
            </span>
          )}
        </button>
      </div>

      {/* Active filter label */}
      {activeFilterLabel && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-xl">
            <Calendar size={13} className="text-purple-400" />
            <span className="text-xs text-purple-300 font-medium">
              {activeFilterLabel}
            </span>
            <button
              onClick={handleClearFilter}
              className="ml-1 text-purple-400 hover:text-purple-200 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
          <span className="text-xs text-gray-500">
            {filteredTransactions.length} transaction
            {filteredTransactions.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Date Filter Panel */}
      {showDateFilter && (
        <DateFilterPanel
          activeQuick={activeQuickFilter}
          onQuickSelect={handleQuickSelect}
          fromDate={customFrom}
          toDate={customTo}
          onFromChange={setCustomFrom}
          onToChange={setCustomTo}
          onClear={handleClearFilter}
          hasActiveFilter={hasActiveFilter}
        />
      )}

      {/* Category Filters */}
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

      {/* Transactions List */}
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
              {hasActiveFilter
                ? "Try adjusting or clearing the date filter"
                : "Try adjusting your filters or add a new transaction"}
            </p>
            {hasActiveFilter && (
              <button
                onClick={handleClearFilter}
                className="mt-3 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-xl text-sm font-medium hover:bg-purple-500/30 transition-all"
              >
                Clear date filter
              </button>
            )}
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

                <Card className="p-4 space-y-4">
                  {Object.entries(dates).map(([date, dayTransactions]) => {
                    const dayTotal = dayTransactions
                      .filter((t) => t.type === "expense")
                      .reduce((sum, t) => sum + t.amount, 0);
                    return (
                      <div key={date}>
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-dark-border/50">
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                            {formatDate(date)}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {dayTransactions.length} txn
                              {dayTransactions.length !== 1 ? "s" : ""}
                            </span>
                            {dayTotal > 0 && (
                              <>
                                <span className="text-xs text-gray-600">•</span>
                                <span className="text-xs text-red-400 font-semibold">
                                  −{formatCurrency(dayTotal)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          {dayTransactions.map((transaction) => (
                            <TransactionRow
                              key={transaction.id}
                              transaction={transaction}
                              category={getCategoryInfo(transaction.category)}
                              onDelete={removeTransaction}
                              onEdit={handleEdit}
                              accounts={accounts}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Transaction Modal */}
      <BottomSheet
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingTransaction(null);
        }}
        title="Edit Transaction"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateTransaction();
          }}
          className="space-y-6 pb-24"
        >
          <div className="flex gap-2 p-1 bg-dark-bg rounded-xl">
            <button
              type="button"
              onClick={() =>
                setEditForm({ ...editForm, type: "expense", category: "food" })
              }
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${editForm.type === "expense" ? "bg-red-500 text-white" : "text-gray-400"}`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() =>
                setEditForm({ ...editForm, type: "income", category: "salary" })
              }
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${editForm.type === "income" ? "bg-green-500 text-white" : "text-gray-400"}`}
            >
              Income
            </button>
          </div>

          <Input
            label="Amount"
            type="number"
            icon={IndianRupee}
            value={editForm.amount}
            onChange={(e) =>
              setEditForm({ ...editForm, amount: e.target.value })
            }
            placeholder="0.00"
            error={errors.amount}
            step="0.01"
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Category
            </label>
            <CategoryPicker
              selected={editForm.category}
              onSelect={(category) => setEditForm({ ...editForm, category })}
              type={editForm.type}
            />
            {errors.category && (
              <p className="mt-1 text-sm text-red-400">{errors.category}</p>
            )}
          </div>

          <Input
            label="Date"
            type="date"
            icon={Calendar}
            value={editForm.date}
            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() =>
                    setEditForm({ ...editForm, paymentMethod: method })
                  }
                  className={`p-3 rounded-xl border transition-all ${editForm.paymentMethod === method ? "border-purple-500 bg-purple-500/10 text-white" : "border-dark-border text-gray-400 hover:border-gray-600"}`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Description (Optional)"
            type="text"
            icon={FileText}
            value={editForm.description}
            onChange={(e) =>
              setEditForm({ ...editForm, description: e.target.value })
            }
            placeholder="Add a note..."
          />

          <Button type="submit" fullWidth size="lg">
            Update Transaction
          </Button>
        </form>
      </BottomSheet>
    </div>
  );
};

export default Expenses;
