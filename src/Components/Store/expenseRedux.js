import { createSlice } from "@reduxjs/toolkit";

const initiaExpenseState = {
  totalExpense: 0,
  expenseItems: [],
};

const expenseSlice = createSlice({
  name: "expense",
  initialState: initiaExpenseState,
  reducers: {
    addExpense(state, action) {
      const { newExpense, data } = action.payload;
      state.expenseItems = [...state.expenseItems, { ...newExpense, id: data }];
      if (newExpense.type === "Debit") {
        state.totalExpense = Number(newExpense.expense) + state.totalExpense;
      }
    },

    deleteExpense(state, action) {
      const deleteItem = action.payload;
      state.expenseItems = state.expenseItems.filter(
        (item) => item.id !== deleteItem.id
      );
      if (deleteItem.type === "Debit") {
        state.totalExpense = deleteItem.expense - state.totalExpense;
      }
    },

    setCartData(state, action) {
      const items = action.payload;
      console.log("items => ", items);
      state.expenseItems = Object.entries(items).map(([id, item]) => ({
        ...item,
        id: id,
      }));
      let total = 0;
      Object.values(items).map((item) => {
        if (item.type === "Debit") {
          total += Number(item.expense);
        }
      });
      state.totalExpense = total;
    },
  },
});

export const expenseActions = expenseSlice.actions;

export default expenseSlice.reducer;
