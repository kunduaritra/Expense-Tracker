import firebaseConfig from "./firebase";

const DB_URL = firebaseConfig.databaseURL;

const sanitizeEmail = (email) => {
  return email.replace(/[.#$[\]]/g, "_");
};

export const saveTransaction = async (email, transaction) => {
  const sanitized = sanitizeEmail(email);
  const transactionId = Date.now().toString();

  const response = await fetch(
    `${DB_URL}/expense/${sanitized}/transactions/${transactionId}.json`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...transaction,
        createdAt: new Date().toISOString(),
      }),
    }
  );

  return await response.json();
};

export const getTransactions = async (email) => {
  const sanitized = sanitizeEmail(email);

  const response = await fetch(
    `${DB_URL}/expense/${sanitized}/transactions.json`
  );

  const data = await response.json();

  if (!data) return [];

  return Object.entries(data).map(([id, trans]) => ({
    id,
    ...trans,
  }));
};

export const deleteTransaction = async (email, transactionId) => {
  const sanitized = sanitizeEmail(email);

  await fetch(
    `${DB_URL}/expense/${sanitized}/transactions/${transactionId}.json`,
    { method: "DELETE" }
  );
};

export const saveGoal = async (email, goal) => {
  const sanitized = sanitizeEmail(email);
  const goalId = Date.now().toString();

  const response = await fetch(
    `${DB_URL}/expense/${sanitized}/goals/${goalId}.json`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...goal,
        createdAt: new Date().toISOString(),
      }),
    }
  );

  return await response.json();
};

export const getGoals = async (email) => {
  const sanitized = sanitizeEmail(email);

  const response = await fetch(`${DB_URL}/expense/${sanitized}/goals.json`);

  const data = await response.json();

  if (!data) return [];

  return Object.entries(data).map(([id, goal]) => ({
    id,
    ...goal,
  }));
};

export const updateGoal = async (email, goalId, updates) => {
  const sanitized = sanitizeEmail(email);

  const response = await fetch(
    `${DB_URL}/expense/${sanitized}/goals/${goalId}.json`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }
  );

  return await response.json();
};

export const saveBudget = async (email, month, budgets) => {
  const sanitized = sanitizeEmail(email);

  const response = await fetch(
    `${DB_URL}/expense/${sanitized}/budgets/${month}.json`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(budgets),
    }
  );

  return await response.json();
};

export const getBudget = async (email, month) => {
  const sanitized = sanitizeEmail(email);

  const response = await fetch(
    `${DB_URL}/expense/${sanitized}/budgets/${month}.json`
  );

  return await response.json();
};
