import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  saveTransaction,
  getTransactions,
  deleteTransaction,
  saveGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  saveBudget,
  getBudget,
  saveCard,
  getCards,
  deleteCard,
  updateCard,
  saveReminder,
  getReminders,
  deleteReminder,
  updateReminder,
  saveAccount,
  getAccounts,
  updateAccountData,
  deleteAccount,
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
  const [reminders, setReminders] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ───────────────────────── LOAD ALL DATA ───────────────────────── */

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setTransactions([]);
      setGoals([]);
      setCards([]);
      setReminders([]);
      setAccounts([]);
      setBudget(50000);
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await Promise.all([
        loadAccounts(),
        loadTransactions(),
        loadGoals(),
        loadCards(),
        loadBudget(),
        loadReminders(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ───────────────────────── TRANSACTIONS ───────────────────────── */

  const loadTransactions = async () => {
    if (!user) return;
    try {
      const data = await getTransactions(user.email);
      setTransactions(data);
    } catch (e) {
      console.error("Error loading transactions:", e);
    }
  };

  const addTransaction = async (transaction) => {
    if (!user) return;

    await saveTransaction(user.email, transaction);
    await loadTransactions();

    // auto-adjust account balance
    if (transaction.accountId) {
      const account = accounts.find((a) => a.id === transaction.accountId);

      if (account) {
        const delta =
          transaction.type === "income"
            ? transaction.amount
            : -transaction.amount;

        await updateAccountData(user.email, transaction.accountId, {
          balance: account.balance + delta,
        });

        await loadAccounts();
      }
    }
  };

  const removeTransaction = async (id) => {
    if (!user) return;
    await deleteTransaction(user.email, id);
    await loadTransactions();
  };

  /* ───────────────────────── GOALS ───────────────────────── */

  const loadGoals = async () => {
    if (!user) return;
    const data = await getGoals(user.email);
    setGoals(data);
  };

  const addGoal = async (goal) => {
    if (!user) return;
    await saveGoal(user.email, goal);
    await loadGoals();
  };

  const modifyGoal = async (id, updates) => {
    if (!user) return;
    await updateGoal(user.email, id, updates);
    await loadGoals();
  };

  const removeGoal = async (id) => {
    if (!user) return;
    await deleteGoal(user.email, id);
    await loadGoals();
  };

  /* ───────────────────────── BUDGET ───────────────────────── */

  const loadBudget = async () => {
    if (!user) return;
    const month = getMonthYear();
    const data = await getBudget(user.email, month);
    if (data?.amount) setBudget(data.amount);
  };

  const updateBudget = async (amount) => {
    if (!user) return;
    const month = getMonthYear();
    await saveBudget(user.email, month, { amount });
    setBudget(amount);
  };

  /* ───────────────────────── CARDS ───────────────────────── */

  const loadCards = async () => {
    if (!user) return;
    const data = await getCards(user.email);
    setCards(data);
  };

  const addCard = async (card) => {
    if (!user) return;
    await saveCard(user.email, card);
    await loadCards();
  };

  const removeCard = async (id) => {
    if (!user) return;
    await deleteCard(user.email, id);
    await loadCards();
  };

  const settleCard = async (id) => {
    if (!user) return;
    await updateCard(user.email, id, { settled: true });
    await loadCards();
  };

  /* ───────────────────────── REMINDERS ───────────────────────── */

  const loadReminders = async () => {
    if (!user) return;
    const data = await getReminders(user.email);
    setReminders(data);
  };

  const addReminder = async (reminder) => {
    if (!user) return;
    await saveReminder(user.email, reminder);
    await loadReminders();
  };

  const removeReminder = async (id) => {
    if (!user) return;
    await deleteReminder(user.email, id);
    await loadReminders();
  };

  const toggleReminder = async (id) => {
    if (!user) return;
    const reminder = reminders.find((r) => r.id === id);
    if (!reminder) return;

    await updateReminder(user.email, id, {
      isActive: !reminder.isActive,
    });
    await loadReminders();
  };

  /* ───────────────────────── ACCOUNTS ───────────────────────── */

  const loadAccounts = async () => {
    if (!user) return;
    const data = await getAccounts(user.email);
    setAccounts(data);
  };

  const addAccount = async (account) => {
    if (!user) return;
    await saveAccount(user.email, account);
    await loadAccounts();
  };

  const updateAccount = async (id, updates) => {
    if (!user) return;
    await updateAccountData(user.email, id, updates);
    await loadAccounts();
  };

  const removeAccount = async (id) => {
    if (!user) return;
    await deleteAccount(user.email, id);
    await loadAccounts();
  };

  /* ───────────────────────── CONTEXT VALUE ───────────────────────── */

  const value = {
    transactions,
    goals,
    cards,
    budget,
    reminders,
    accounts,
    loading,

    addTransaction,
    removeTransaction,

    addGoal,
    modifyGoal,
    removeGoal,

    updateBudget,

    addCard,
    removeCard,
    settleCard,

    addReminder,
    removeReminder,
    toggleReminder,

    addAccount,
    updateAccount,
    removeAccount,

    refreshData: loadData,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};
