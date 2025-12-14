import React, { useState } from "react";
import BottomSheet from "../common/BottomSheet";
import Button from "../common/Button";
import Input from "../common/Input";
import { Target, DollarSign, Calendar } from "lucide-react";

const AddGoalModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "0",
    deadline: "",
    category: "Savings",
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.title) newErrors.title = "Please enter a goal title";
    if (!formData.targetAmount || formData.targetAmount <= 0) {
      newErrors.targetAmount = "Please enter a valid target amount";
    }
    if (!formData.deadline) newErrors.deadline = "Please select a deadline";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
      contributions: [], // Initialize empty contributions array
    });

    setFormData({
      title: "",
      targetAmount: "",
      currentAmount: "0",
      deadline: "",
      category: "Savings",
    });
    setErrors({});
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Create New Goal">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Goal Title"
          type="text"
          icon={Target}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Emergency Fund, Vacation"
          error={errors.title}
        />

        <Input
          label="Target Amount"
          type="number"
          icon={DollarSign}
          value={formData.targetAmount}
          onChange={(e) =>
            setFormData({ ...formData, targetAmount: e.target.value })
          }
          placeholder="100000"
          error={errors.targetAmount}
          step="100"
        />

        <Input
          label="Current Amount (Optional)"
          type="number"
          icon={DollarSign}
          value={formData.currentAmount}
          onChange={(e) =>
            setFormData({ ...formData, currentAmount: e.target.value })
          }
          placeholder="0"
          step="100"
        />

        <Input
          label="Deadline"
          type="date"
          icon={Calendar}
          value={formData.deadline}
          onChange={(e) =>
            setFormData({ ...formData, deadline: e.target.value })
          }
          error={errors.deadline}
          min={new Date().toISOString().split("T")[0]}
        />

        <Button type="submit" fullWidth size="lg">
          Create Goal
        </Button>
      </form>
    </BottomSheet>
  );
};

export default AddGoalModal;
