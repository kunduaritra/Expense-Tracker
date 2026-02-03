import React, { useState } from "react";
import { useExpense } from "../hooks/useExpenses";
import GoalCard from "../components/goals/GoalCard";
import AddGoalModal from "../components/goals/AddGoalModal";
import BottomSheet from "../components/common/BottomSheet";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import {
  Target,
  Plus,
  IndianRupee,
  Calendar,
  Settings,
  Trash2,
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";

const Goals = () => {
  const { goals, addGoal, modifyGoal, removeGoal } = useExpense();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showEditContributionModal, setShowEditContributionModal] =
    useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [contributionIndex, setContributionIndex] = useState(null);
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

  const handleEditGoal = (goal) => {
    setSelectedGoal(goal);
    setShowEditModal(true);
  };

  const handleDeleteGoal = async (goalId) => {
    if (
      confirm(
        "Are you sure you want to delete this goal? This action cannot be undone.",
      )
    ) {
      await removeGoal(goalId);
    }
  };

  const handleViewHistory = (goal) => {
    setSelectedGoal(goal);
    setShowHistoryModal(true);
  };

  const handleEditContribution = (goal, contrib, index) => {
    setSelectedGoal(goal);
    setSelectedContribution(contrib);
    setContributionIndex(index);
    setContribution({
      amount: contrib.amount.toString(),
      date: contrib.date,
    });
    setShowEditContributionModal(true);
  };

  const handleDeleteContribution = async (goal, index) => {
    if (!confirm("Delete this contribution?")) return;

    const updatedContributions = [...(goal.contributions || [])];
    const deletedAmount = updatedContributions[index].amount;
    updatedContributions.splice(index, 1);

    await modifyGoal(goal.id, {
      contributions: updatedContributions,
      currentAmount: goal.currentAmount - deletedAmount,
    });
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

  const handleUpdateContribution = async () => {
    if (!selectedGoal || !contribution.amount || contributionIndex === null)
      return;

    const amount = parseFloat(contribution.amount);
    if (isNaN(amount) || amount <= 0) return;

    const updatedContributions = [...(selectedGoal.contributions || [])];
    const oldAmount = updatedContributions[contributionIndex].amount;

    updatedContributions[contributionIndex] = {
      amount,
      date: contribution.date,
      timestamp: new Date().toISOString(),
    };

    const amountDifference = amount - oldAmount;

    await modifyGoal(selectedGoal.id, {
      contributions: updatedContributions,
      currentAmount: selectedGoal.currentAmount + amountDifference,
    });

    setShowEditContributionModal(false);
    setSelectedGoal(null);
    setSelectedContribution(null);
    setContributionIndex(null);
    setContribution({
      amount: "",
      date: new Date().toISOString().split("T")[0],
    });

    // Refresh history modal if open
    if (showHistoryModal) {
      const updatedGoal = goals.find((g) => g.id === selectedGoal.id);
      setSelectedGoal(updatedGoal);
    }
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
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
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

      {/* Edit Goal Modal */}
      <AddGoalModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedGoal(null);
        }}
        onSubmit={(updatedGoal) => {
          modifyGoal(selectedGoal.id, updatedGoal);
          setShowEditModal(false);
          setSelectedGoal(null);
        }}
        initialData={selectedGoal}
        isEdit={true}
      />

      {/* Contribute Modal */}
      <BottomSheet
        isOpen={showContributeModal}
        onClose={() => setShowContributeModal(false)}
        title="Add Contribution"
      >
        {selectedGoal && (
          <div className="space-y-6 overflow-y-auto max-h-[70vh] pb-28">
            <p className="text-gray-400">
              Contributing to{" "}
              <span className="font-semibold text-white">
                "{selectedGoal.title}"
              </span>
            </p>

            <Input
              label="Amount"
              type="number"
              icon={IndianRupee}
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
          <div className="space-y-4 overflow-y-auto max-h-[70vh] pb-28">
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
                  .map((contrib, index) => {
                    const originalIndex = selectedGoal.contributions.findIndex(
                      (c) =>
                        c.amount === contrib.amount &&
                        c.date === contrib.date &&
                        c.timestamp === contrib.timestamp,
                    );

                    return (
                      <div
                        key={index}
                        className="p-4 bg-dark-bg rounded-xl flex justify-between items-center group"
                      >
                        <div>
                          <p className="font-semibold text-green-400">
                            +{formatCurrency(contrib.amount)}
                          </p>
                          <p className="text-sm text-gray-400">
                            {new Date(contrib.date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setShowHistoryModal(false);
                              handleEditContribution(
                                selectedGoal,
                                contrib,
                                originalIndex,
                              );
                            }}
                            className="p-2 hover:bg-blue-500/20 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Settings size={16} className="text-blue-400" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteContribution(
                                selectedGoal,
                                originalIndex,
                              )
                            }
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </BottomSheet>

      {/* Edit Contribution Modal */}
      <BottomSheet
        isOpen={showEditContributionModal}
        onClose={() => {
          setShowEditContributionModal(false);
          setSelectedGoal(null);
          setSelectedContribution(null);
          setContributionIndex(null);
        }}
        title="Edit Contribution"
      >
        {selectedGoal && (
          <div className="space-y-6 overflow-y-auto max-h-[70vh] pb-28">
            <p className="text-gray-400">
              Editing contribution for{" "}
              <span className="font-semibold text-white">
                "{selectedGoal.title}"
              </span>
            </p>

            <Input
              label="Amount"
              type="number"
              icon={IndianRupee}
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
                onClick={() => {
                  setShowEditContributionModal(false);
                  setShowHistoryModal(true);
                }}
                fullWidth
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateContribution} fullWidth>
                Update Contribution
              </Button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};

export default Goals;
