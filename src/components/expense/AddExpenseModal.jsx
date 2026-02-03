import React, { useState } from "react";
import BottomSheet from "../common/BottomSheet";
import Button from "../common/Button";
import Input from "../common/Input";
import CategoryPicker from "./CategoryPicker";
import { IndianRupee, Calendar, FileText } from "lucide-react";

const PAYMENT_METHODS = ["Cash", "UPI", "Card", "Credit Card", "Net Banking"];

const AddExpenseModal = ({ isOpen, onClose, onSubmit, savedCards = [] }) => {
  const [formData, setFormData] = useState({
    amount: "",
    category: "food",
    date: new Date().toISOString().split("T")[0],
    description: "",
    paymentMethod: "UPI",
    type: "expense",
    cardId: null,
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

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

    setFormData({
      amount: "",
      category: "food",
      date: new Date().toISOString().split("T")[0],
      description: "",
      paymentMethod: "UPI",
      type: "expense",
      cardId: null,
    });
    setErrors({});
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Add Transaction">
      <form onSubmit={handleSubmit} className="space-y-6 pb-28">
        {/* Type Toggle */}
        <div className="flex gap-2 p-1 bg-dark-bg rounded-xl">
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, type: "expense", category: "food" })
            }
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
            onClick={() =>
              setFormData({ ...formData, type: "income", category: "salary" })
            }
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
            type={formData.type}
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

        {/* Saved Cards Selection (Only for Card payment) */}
        {formData.paymentMethod === "Card" &&
          savedCards.length > 0 &&
          formData.type === "expense" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Select Card (Optional)
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, cardId: null })}
                  className={`w-full p-3 rounded-xl border transition-all text-left ${
                    !formData.cardId
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-dark-border hover:border-gray-600"
                  }`}
                >
                  <p className="font-medium">No Card (One-time payment)</p>
                </button>
                {savedCards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, cardId: card.id })
                    }
                    className={`w-full p-3 rounded-xl border transition-all text-left ${
                      formData.cardId === card.id
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-dark-border hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{card.name}</p>
                        <p className="text-sm text-gray-400">
                          **** {card.last4}
                        </p>
                      </div>
                      {!card.settled && (
                        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
                          Pending
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

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
