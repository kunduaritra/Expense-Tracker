import React, { useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import Input from "../common/Input";
import BottomSheet from "../common/BottomSheet";
import {
  Bell,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

const REMINDER_CATEGORIES = [
  {
    id: "electricity",
    name: "Electricity Bill",
    emoji: "💡",
    color: "#F59E0B",
  },
  { id: "water", name: "Water Bill", emoji: "💧", color: "#06B6D4" },
  { id: "gas", name: "Gas Bill", emoji: "🔥", color: "#EF4444" },
  { id: "credit_card", name: "Credit Card", emoji: "💳", color: "#8B5CF6" },
  { id: "sip", name: "SIP Investment", emoji: "📈", color: "#10B981" },
  { id: "medicine", name: "Medicine Refill", emoji: "💊", color: "#EC4899" },
  { id: "rent", name: "Rent", emoji: "🏠", color: "#6366F1" },
  { id: "subscription", name: "Subscription", emoji: "📱", color: "#14B8A6" },
  { id: "insurance", name: "Insurance", emoji: "🛡️", color: "#F59E0B" },
  { id: "custom", name: "Custom", emoji: "⚙️", color: "#64748B" },
];

const REPEAT_OPTIONS = [
  { id: "once", name: "One Time" },
  { id: "daily", name: "Daily" },
  { id: "weekly", name: "Weekly" },
  { id: "monthly", name: "Monthly" },
  { id: "yearly", name: "Yearly" },
];

const ReminderManager = ({
  reminders,
  onAddReminder,
  onDeleteReminder,
  onToggleReminder,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "electricity",
    amount: "",
    dueDate: "",
    repeat: "monthly",
    isActive: true,
    notes: "",
  });

  const getCategoryInfo = (categoryId) => {
    return (
      REMINDER_CATEGORIES.find((cat) => cat.id === categoryId) ||
      REMINDER_CATEGORIES[0]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.dueDate) {
      alert("Please fill in all required fields");
      return;
    }

    onAddReminder({
      ...formData,
      amount: formData.amount ? parseFloat(formData.amount) : 0,
      createdAt: new Date().toISOString(),
    });

    setFormData({
      title: "",
      category: "electricity",
      amount: "",
      dueDate: "",
      repeat: "monthly",
      isActive: true,
      notes: "",
    });
    setShowAddModal(false);
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (daysUntil) => {
    if (daysUntil < 0) return "text-red-400 bg-red-500/10";
    if (daysUntil <= 3) return "text-orange-400 bg-orange-500/10";
    if (daysUntil <= 7) return "text-yellow-400 bg-yellow-500/10";
    return "text-green-400 bg-green-500/10";
  };

  const getStatusText = (daysUntil) => {
    if (daysUntil < 0)
      return `Overdue by ${Math.abs(daysUntil)} day${Math.abs(daysUntil) > 1 ? "s" : ""}`;
    if (daysUntil === 0) return "Due Today";
    if (daysUntil === 1) return "Due Tomorrow";
    return `Due in ${daysUntil} days`;
  };

  // Sort reminders by due date
  const sortedReminders = [...reminders].sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
  );

  // Get upcoming reminders (next 7 days)
  const upcomingReminders = sortedReminders.filter((r) => {
    const daysUntil = getDaysUntilDue(r.dueDate);
    return r.isActive && daysUntil >= 0 && daysUntil <= 7;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bill Reminders</h2>
          <p className="text-gray-400">Never miss a payment</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} icon={Plus} size="sm">
          Add Reminder
        </Button>
      </div>

      {/* Upcoming Reminders Alert */}
      {upcomingReminders.length > 0 && (
        <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20">
          <div className="flex items-start gap-3">
            <AlertCircle
              className="text-orange-400 flex-shrink-0 mt-1"
              size={20}
            />
            <div>
              <h3 className="font-semibold text-orange-400 mb-1">
                Upcoming Payments
              </h3>
              <p className="text-sm text-gray-300">
                You have {upcomingReminders.length} payment
                {upcomingReminders.length > 1 ? "s" : ""} due in the next 7 days
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Reminders List */}
      {sortedReminders.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Bell className="mx-auto mb-4 text-gray-400" size={48} />
            <h3 className="text-lg font-semibold mb-2">No Reminders Set</h3>
            <p className="text-gray-400 mb-4">
              Add your first bill reminder to stay on top of payments
            </p>
            <Button onClick={() => setShowAddModal(true)} icon={Plus}>
              Add Your First Reminder
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedReminders.map((reminder) => {
            const category = getCategoryInfo(reminder.category);
            const daysUntil = getDaysUntilDue(reminder.dueDate);
            const statusColor = getStatusColor(daysUntil);
            const statusText = getStatusText(daysUntil);

            return (
              <Card
                key={reminder.id}
                className={!reminder.isActive ? "opacity-50" : ""}
              >
                <div className="flex items-center gap-4">
                  {/* Category Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {category.emoji}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="font-semibold">{reminder.title}</h3>
                        <p className="text-sm text-gray-400">{category.name}</p>
                      </div>
                      {reminder.amount > 0 && (
                        <p className="text-lg font-bold">
                          {formatCurrency(reminder.amount)}
                        </p>
                      )}
                    </div>

                    {/* Status & Date */}
                    <div className="flex items-center gap-3 text-sm">
                      <span className={`px-2 py-1 rounded-lg ${statusColor}`}>
                        {statusText}
                      </span>
                      <span className="text-gray-400">
                        {new Date(reminder.dueDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </span>
                      {reminder.repeat !== "once" && (
                        <span className="text-gray-400 flex items-center gap-1">
                          <RefreshCw size={14} />
                          {reminder.repeat}
                        </span>
                      )}
                    </div>

                    {reminder.notes && (
                      <p className="text-sm text-gray-400 mt-2">
                        {reminder.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleReminder(reminder.id)}
                      className={`p-2 rounded-lg transition-all ${
                        reminder.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                      title={reminder.isActive ? "Active" : "Inactive"}
                    >
                      <Bell size={18} />
                    </button>
                    <button
                      onClick={() => onDeleteReminder(reminder.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Reminder Modal */}
      <BottomSheet
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Bill Reminder"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Input
            label="Reminder Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="e.g., Electricity Bill"
            required
          />

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {REMINDER_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, category: category.id })
                  }
                  className={`p-3 rounded-xl border transition-all ${
                    formData.category === category.id
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-dark-border hover:border-gray-600"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{category.emoji}</div>
                    <div className="text-xs">{category.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <Input
            label="Amount (Optional)"
            type="number"
            icon={DollarSign}
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            placeholder="0"
            step="0.01"
          />

          {/* Due Date */}
          <Input
            label="Due Date"
            type="date"
            icon={Calendar}
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            required
            min={new Date().toISOString().split("T")[0]}
          />

          {/* Repeat */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Repeat
            </label>
            <div className="grid grid-cols-3 gap-2">
              {REPEAT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, repeat: option.id })
                  }
                  className={`p-3 rounded-xl border transition-all ${
                    formData.repeat === option.id
                      ? "border-purple-500 bg-purple-500/10 text-white"
                      : "border-dark-border text-gray-400 hover:border-gray-600"
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Add any additional notes..."
              className="w-full px-4 py-3 bg-dark-card rounded-xl border border-dark-border text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
              rows={3}
            />
          </div>

          {/* Submit */}
          <Button type="submit" fullWidth size="lg">
            Add Reminder
          </Button>
        </form>
      </BottomSheet>
    </div>
  );
};

export default ReminderManager;
