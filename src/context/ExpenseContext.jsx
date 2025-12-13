import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  saveTransaction,
  getTransactions,
  deleteTransaction,
  saveGoal,
  getGoals,
  updateGoal,
  saveBudget,
  getBudget,
} from "../services/expenseService";
import { getMonthYear } from "../utils/dateUtils";

export const ExpenseContext = createContext();

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpense must be used within ExpenseProvider");
  }
  return context;
};

export const ExpenseProvider = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load data when user changes
  useEffect(() => {
    if (user) {
      loadTransactions();
      loadGoals();
      loadBudget();
    } else {
      setTransactions([]);
      setGoals([]);
      setBudget(null);
    }
  }, [user]);

  const loadTransactions = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getTransactions(user.email);
      setTransactions(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction) => {
    if (!user) return;
    try {
      await saveTransaction(user.email, transaction);
      await loadTransactions();
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  };

  const removeTransaction = async (transactionId) => {
    if (!user) return;
    try {
      await deleteTransaction(user.email, transactionId);
      await loadTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  };

  const loadGoals = async () => {
    if (!user) return;
    try {
      const data = await getGoals(user.email);
      setGoals(data);
    } catch (error) {
      console.error("Error loading goals:", error);
    }
  };

  const addGoal = async (goal) => {
    if (!user) return;
    try {
      await saveGoal(user.email, goal);
      await loadGoals();
    } catch (error) {
      console.error("Error adding goal:", error);
      throw error;
    }
  };

  const modifyGoal = async (goalId, updates) => {
    if (!user) return;
    try {
      await updateGoal(user.email, goalId, updates);
      await loadGoals();
    } catch (error) {
      console.error("Error updating goal:", error);
      throw error;
    }
  };

  const loadBudget = async () => {
    if (!user) return;
    try {
      const currentMonth = getMonthYear();
      const data = await getBudget(user.email, currentMonth);
      setBudget(data);
    } catch (error) {
      console.error("Error loading budget:", error);
    }
  };

  const updateBudget = async (budgetData) => {
    if (!user) return;
    try {
      const currentMonth = getMonthYear();
      await saveBudget(user.email, currentMonth, budgetData);
      await loadBudget();
    } catch (error) {
      console.error("Error updating budget:", error);
      throw error;
    }
  };

  const value = {
    transactions,
    goals,
    budget,
    loading,
    addTransaction,
    removeTransaction,
    addGoal,
    modifyGoal,
    updateBudget,
    refreshData: loadTransactions,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};
