import React, { useState } from "react";
import { useExpense } from "../hooks/useExpenses";
import GoalCard from "../components/goals/GoalCard";
import AddGoalModal from "../components/goals/AddGoalModal";
import BottomSheet from "../components/common/BottomSheet";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { Target, Plus, DollarSign, Calendar, History } from "lucide-react";
import { formatCurrency } from "../utils/formatters";

const Goals = () => {
  const { goals, addGoal, modifyGoal } = useExpense();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [contribution, setContribution] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleContribute = (goal) => {
    setSelectedGoal(goal);
    setContribution({
      amount: "",
      date: new Date().toISOString().split("T")[0],
    });
    setShowContributeModal(true);
  };

  const handleViewHistory = (goal) => {
    setSelectedGoal(goal);
    setShowHistoryModal(true);
  };

  const handleConfirmContribution = async () => {
    if (!selectedGoal || !contribution.amount) return;

    const amount = parseFloat(contribution.amount);
    if (isNaN(amount) || amount <= 0) return;

    const newContribution = {
      amount,
      date: contribution.date,
      timestamp: new Date().toISOString(),
    };

    const contributions = selectedGoal.contributions || [];

    await modifyGoal(selectedGoal.id, {
      currentAmount: selectedGoal.currentAmount + amount,
      contributions: [...contributions, newContribution],
    });

    setShowContributeModal(false);
    setSelectedGoal(null);
    setContribution({
      amount: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Financial Goals</h1>
          <p className="text-gray-400">Track your savings goals</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} icon={Plus}>
          New Goal
        </Button>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 gradient-card rounded-full flex items-center justify-center mx-auto mb-4">
            <Target size={40} className="text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Goals Yet</h3>
          <p className="text-gray-400 mb-6">
            Create your first financial goal to get started
          </p>
          <Button onClick={() => setShowAddModal(true)} icon={Plus}>
            Create Goal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onContribute={handleContribute}
              onViewHistory={handleViewHistory}
            />
          ))}
        </div>
      )}

      {/* Add Goal Modal */}
      <AddGoalModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={addGoal}
      />

      {/* Contribute Modal */}
      <BottomSheet
        isOpen={showContributeModal}
        onClose={() => setShowContributeModal(false)}
        title="Add Contribution"
      >
        {selectedGoal && (
          <div className="space-y-6">
            <p className="text-gray-400">
              Contributing to{" "}
              <span className="font-semibold text-white">
                "{selectedGoal.title}"
              </span>
            </p>

            <Input
              label="Amount"
              type="number"
              icon={DollarSign}
              value={contribution.amount}
              onChange={(e) =>
                setContribution({ ...contribution, amount: e.target.value })
              }
              placeholder="Enter amount"
              step="100"
            />

            <Input
              label="Date"
              type="date"
              icon={Calendar}
              value={contribution.date}
              onChange={(e) =>
                setContribution({ ...contribution, date: e.target.value })
              }
            />

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowContributeModal(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmContribution} fullWidth>
                Add Contribution
              </Button>
            </div>
          </div>
        )}
      </BottomSheet>

      {/* History Modal */}
      <BottomSheet
        isOpen={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false);
          setSelectedGoal(null);
        }}
        title="Contribution History"
      >
        {selectedGoal && (
          <div className="space-y-4">
            <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <p className="text-sm text-gray-400 mb-1">
                Goal: {selectedGoal.title}
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(selectedGoal.currentAmount)} /{" "}
                {formatCurrency(selectedGoal.targetAmount)}
              </p>
            </div>

            {!selectedGoal.contributions ||
            selectedGoal.contributions.length === 0 ? (
              <p className="text-center text-gray-400 py-8">
                No contributions yet
              </p>
            ) : (
              <div className="space-y-3">
                {[...selectedGoal.contributions]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((contrib, index) => (
                    <div
                      key={index}
                      className="p-4 bg-dark-bg rounded-xl flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-green-400">
                          +{formatCurrency(contrib.amount)}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(contrib.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </BottomSheet>
    </div>
  );
};

export default Goals;
