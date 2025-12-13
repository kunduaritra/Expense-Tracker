import React from "react";
import Card from "../common/Card";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { Trash2 } from "lucide-react";

const CATEGORIES = [
  { id: "food", name: "Food & Dining", emoji: "🍕", color: "#EF4444" },
  { id: "transport", name: "Transportation", emoji: "🚗", color: "#F59E0B" },
  { id: "shopping", name: "Shopping", emoji: "🛍️", color: "#EC4899" },
  { id: "entertainment", name: "Entertainment", emoji: "🎬", color: "#8B5CF6" },
  { id: "bills", name: "Bills & Utilities", emoji: "💡", color: "#3B82F6" },
  { id: "health", name: "Health", emoji: "💊", color: "#10B981" },
  { id: "education", name: "Education", emoji: "📚", color: "#6366F1" },
  { id: "travel", name: "Travel", emoji: "✈️", color: "#06B6D4" },
  { id: "investment", name: "Investment", emoji: "📈", color: "#14B8A6" },
  { id: "others", name: "Others", emoji: "📦", color: "#64748B" },
];

const RecentTransactions = ({ transactions, onDelete }) => {
  const getCategoryInfo = (categoryId) => {
    return CATEGORIES.find((cat) => cat.id === categoryId) || CATEGORIES[9];
  };

  const sortedTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>

      {sortedTransactions.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No transactions yet</p>
          <p className="text-sm mt-1">Add your first expense to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTransactions.map((transaction) => {
            const category = getCategoryInfo(transaction.category);
            const isIncome = transaction.type === "income";

            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-xl bg-dark-bg hover:bg-opacity-70 transition-all group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {category.emoji}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">
                      {transaction.description || category.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatDate(transaction.date)} •{" "}
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

                  {onDelete && (
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition-all"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default RecentTransactions;
