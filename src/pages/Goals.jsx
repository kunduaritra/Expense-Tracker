import React, { useState } from "react";
import { useExpense } from "../hooks/useExpenses";
import GoalCard from "../components/goals/GoalCard";
import AddGoalModal from "../components/goals/AddGoalModal";
import Button from "../components/common/Button";
import { Target, Plus } from "lucide-react";

const Goals = () => {
  const { goals, addGoal, modifyGoal } = useExpense();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [contributionAmount, setContributionAmount] = useState("");

  const handleContribute = (goal) => {
    setSelectedGoal(goal);
    setShowContributeModal(true);
  };

  const handleConfirmContribution = async () => {
    if (!selectedGoal || !contributionAmount) return;

    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) return;

    await modifyGoal(selectedGoal.id, {
      currentAmount: selectedGoal.currentAmount + amount,
    });

    setShowContributeModal(false);
    setSelectedGoal(null);
    setContributionAmount("");
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
      {showContributeModal && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowContributeModal(false)}
          />
          <div className="relative bg-dark-card p-6 rounded-2xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add Contribution</h3>
            <p className="text-gray-400 mb-4">
              How much would you like to contribute to "{selectedGoal.title}"?
            </p>

            <input
              type="number"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-3 bg-dark-bg rounded-xl border border-dark-border text-white mb-4 focus:outline-none focus:border-purple-500"
              step="100"
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
                Contribute
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
