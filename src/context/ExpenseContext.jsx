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
  saveCard,
  getCards,
  deleteCard,
  updateCard,
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
  const [cards, setCards] = useState([]);
  const [budget, setBudget] = useState(50000);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setTransactions([]);
      setGoals([]);
      setCards([]);
      setBudget(50000);
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadTransactions(),
        loadGoals(),
        loadCards(),
        loadBudget(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    if (!user) return;
    try {
      const data = await getTransactions(user.email);
      setTransactions(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
    }
  };

  const addTransaction = async (transaction) => {
    if (!user) return;
    try {
      await saveTransaction(user.email, transaction);
      await loadTransactions();

      // If transaction is linked to a card, update card
      if (transaction.cardId) {
        await loadCards();
      }
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
      if (data && data.amount) {
        setBudget(data.amount);
      }
    } catch (error) {
      console.error("Error loading budget:", error);
    }
  };

  const updateBudget = async (amount) => {
    if (!user) return;
    try {
      const currentMonth = getMonthYear();
      await saveBudget(user.email, currentMonth, { amount });
      setBudget(amount);
    } catch (error) {
      console.error("Error updating budget:", error);
      throw error;
    }
  };

  const loadCards = async () => {
    if (!user) return;
    try {
      const data = await getCards(user.email);
      setCards(data);
    } catch (error) {
      console.error("Error loading cards:", error);
    }
  };

  const addCard = async (card) => {
    if (!user) return;
    try {
      await saveCard(user.email, card);
      await loadCards();
    } catch (error) {
      console.error("Error adding card:", error);
      throw error;
    }
  };

  const removeCard = async (cardId) => {
    if (!user) return;
    try {
      await deleteCard(user.email, cardId);
      await loadCards();
    } catch (error) {
      console.error("Error deleting card:", error);
      throw error;
    }
  };

  const settleCard = async (cardId) => {
    if (!user) return;
    try {
      await updateCard(user.email, cardId, { settled: true });
      await loadCards();
    } catch (error) {
      console.error("Error settling card:", error);
      throw error;
    }
  };

  const value = {
    transactions,
    goals,
    cards,
    budget,
    loading,
    addTransaction,
    removeTransaction,
    addGoal,
    modifyGoal,
    updateBudget,
    addCard,
    removeCard,
    settleCard,
    refreshData: loadData,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};
