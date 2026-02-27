import React from "react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../../utils/constants";

const CategoryPicker = ({ selected, onSelect, type = "expense" }) => {
  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="max-h-64 overflow-y-auto pr-1">
      <div className="grid grid-cols-3 gap-3">
        {categories.map((category) => (
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
    </div>
  );
};

export default CategoryPicker;
