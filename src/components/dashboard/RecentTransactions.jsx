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
  const getCategoryInfo = (categoryId) =>
    CATEGORIES.find((cat) => cat.id === categoryId) || CATEGORIES[9];

  const sortedTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6); // keep compact

  return (
    <Card className="p-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-dark-border">
        <h3 className="font-semibold text-sm">Recent Transactions</h3>
      </div>

      {sortedTransactions.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          No transactions yet
        </div>
      ) : (
        <ul className="divide-y divide-dark-border">
          {sortedTransactions.map((transaction) => {
            const category = getCategoryInfo(transaction.category);
            const isIncome = transaction.type === "income";

            return (
              <li
                key={transaction.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-dark-bg/60 transition-colors group"
              >
                {/* Emoji */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  {category.emoji}
                </div>

                {/* Description */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {transaction.description || category.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(transaction.date)}
                    {transaction.paymentMethod &&
                      ` • ${transaction.paymentMethod}`}
                  </p>
                </div>

                {/* Amount */}
                <div
                  className={`text-sm font-mono font-semibold ${
                    isIncome ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </div>

                {/* Delete */}
                {onDelete && (
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2
                      size={16}
                      className="text-gray-400 hover:text-red-400"
                    />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
};

export default React.memo(RecentTransactions);
