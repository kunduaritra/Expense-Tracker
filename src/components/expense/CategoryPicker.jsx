import React from "react";

const CATEGORIES = [
  { id: "food", name: "Food", emoji: "🍕" },
  { id: "transport", name: "Transport", emoji: "🚗" },
  { id: "shopping", name: "Shopping", emoji: "🛍️" },
  { id: "entertainment", name: "Entertainment", emoji: "🎬" },
  { id: "bills", name: "Bills", emoji: "💡" },
  { id: "health", name: "Health", emoji: "💊" },
  { id: "education", name: "Education", emoji: "📚" },
  { id: "travel", name: "Travel", emoji: "✈️" },
  { id: "investment", name: "Investment", emoji: "📈" },
  { id: "others", name: "Others", emoji: "📦" },
];

const CategoryPicker = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-5 gap-3">
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(category.id)}
          className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
            selected === category.id
              ? "border-purple-500 bg-purple-500/10 scale-105"
              : "border-dark-border hover:border-gray-600"
          }`}
        >
          <span className="text-2xl">{category.emoji}</span>
          <span className="text-xs text-center">{category.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryPicker;
