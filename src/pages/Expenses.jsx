import React, { useState } from "react";
import { useExpense } from "../hooks/useExpenses";
import Card from "../components/common/Card";
import { formatCurrency, formatDate } from "../utils/formatters";
import { Filter, Search, Trash2 } from "lucide-react";

const CATEGORIES = [
  { id: "all", name: "All Categories", emoji: "📊" },
  { id: "food", name: "Food & Dining", emoji: "🍕" },
  { id: "transport", name: "Transportation", emoji: "🚗" },
  { id: "shopping", name: "Shopping", emoji: "🛍️" },
  { id: "entertainment", name: "Entertainment", emoji: "🎬" },
  { id: "bills", name: "Bills & Utilities", emoji: "💡" },
  { id: "health", name: "Health", emoji: "💊" },
  { id: "education", name: "Education", emoji: "📚" },
  { id: "travel", name: "Travel", emoji: "✈️" },
  { id: "investment", name: "Investment", emoji: "📈" },
  { id: "others", name: "Others", emoji: "📦" },
];

const Expenses = () => {
  const { transactions, removeTransaction } = useExpense();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Group by date
  const groupedByDate = sortedTransactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(transaction);
    return groups;
  }, {});

  const getCategoryInfo = (categoryId) => {
    return CATEGORIES.find((cat) => cat.id === categoryId) || CATEGORIES[10];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">All Transactions</h1>
        <p className="text-gray-400">View and manage your transactions</p>
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
          className="w-full pl-12 pr-4 py-3 bg-dark-card rounded-xl border border-dark-border text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              selectedCategory === category.id
                ? "bg-purple-500 text-white"
                : "bg-dark-card text-gray-400 hover:bg-dark-border"
            }`}
          >
            <span>{category.emoji}</span>
            <span className="text-sm font-medium">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Transaction List */}
      {Object.keys(groupedByDate).length === 0 ? (
        <Card>
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg mb-1">No transactions found</p>
            <p className="text-sm">
              Try adjusting your filters or add a new transaction
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedByDate).map(([date, dayTransactions]) => (
            <Card key={date}>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">{formatDate(date)}</h3>
                <p className="text-sm text-gray-400">
                  {dayTransactions.length} transaction
                  {dayTransactions.length > 1 ? "s" : ""}
                </p>
              </div>

              <div className="space-y-2">
                {dayTransactions.map((transaction) => {
                  const category = getCategoryInfo(transaction.category);
                  const isIncome = transaction.type === "income";

                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-dark-bg hover:bg-opacity-70 transition-all group"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-dark-card">
                          {category.emoji}
                        </div>

                        <div className="flex-1">
                          <p className="font-medium">
                            {transaction.description || category.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {transaction.paymentMethod}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <p
                          className={`font-semibold ${
                            isIncome ? "text-green-400" : "text-white"
                          }`}
                        >
                          {isIncome ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>

                        <button
                          onClick={() => removeTransaction(transaction.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition-all"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Expenses;
