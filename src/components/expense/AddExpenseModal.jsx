import React, { useState } from "react";
import BottomSheet from "../common/BottomSheet";
import Button from "../common/Button";
import Input from "../common/Input";
import CategoryPicker from "./CategoryPicker";
import { IndianRupee, Calendar, FileText, CreditCard } from "lucide-react";

const PAYMENT_METHODS = ["Cash", "Card", "UPI", "Net Banking"];

const AddExpenseModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: "",
    category: "food",
    date: new Date().toISOString().split("T")[0],
    description: "",
    paymentMethod: "UPI",
    type: "expense",
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
    });

    // Reset form
    setFormData({
      amount: "",
      category: "food",
      date: new Date().toISOString().split("T")[0],
      description: "",
      paymentMethod: "UPI",
      type: "expense",
    });
    setErrors({});
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Add Transaction">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type Toggle */}
        <div className="flex gap-2 p-1 bg-dark-bg rounded-xl">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: "expense" })}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              formData.type === "expense"
                ? "bg-red-500 text-white"
                : "text-gray-400"
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: "income" })}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              formData.type === "income"
                ? "bg-green-500 text-white"
                : "text-gray-400"
            }`}
          >
            Income
          </button>
        </div>

        {/* Amount */}
        <div>
          <Input
            label="Amount"
            type="number"
            icon={IndianRupee}
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            placeholder="0.00"
            error={errors.amount}
            step="0.01"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Category
          </label>
          <CategoryPicker
            selected={formData.category}
            onSelect={(category) => setFormData({ ...formData, category })}
          />
          {errors.category && (
            <p className="mt-1 text-sm text-red-400">{errors.category}</p>
          )}
        </div>

        {/* Date */}
        <Input
          label="Date"
          type="date"
          icon={Calendar}
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />

        {/* Payment Method */}
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
                  setFormData({ ...formData, paymentMethod: method })
                }
                className={`p-3 rounded-xl border transition-all ${
                  formData.paymentMethod === method
                    ? "border-purple-500 bg-purple-500/10 text-white"
                    : "border-dark-border text-gray-400 hover:border-gray-600"
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <Input
          label="Description (Optional)"
          type="text"
          icon={FileText}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Add a note..."
        />

        {/* Submit Button */}
        <Button type="submit" fullWidth size="lg">
          Add {formData.type === "expense" ? "Expense" : "Income"}
        </Button>
      </form>
    </BottomSheet>
  );
};

export default AddExpenseModal;
