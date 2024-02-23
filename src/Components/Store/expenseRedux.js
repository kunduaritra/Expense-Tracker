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
      state.totalExpense = Number(newExpense.expense) + state.totalExpense;
      console.log(state.totalExpense);
    },

    deleteExpense(state, action) {
      const deleteItem = action.payload;
      state.expenseItems = state.expenseItems.filter(
        (item) => item.id !== deleteItem.id
      );
      state.totalExpense = deleteItem.expense - state.totalExpense;
    },

    setCartData(state, action) {
      const items = action.payload;

      state.expenseItems = Object.entries(items).map(([id, item]) => ({
        ...item,
        id: id,
      }));
      let total = 0;
      Object.entries(items).forEach(([key, value]) => {
        if (value.type === "Debit") {
          total = Number(value.expense) + total;
        }
      });
      state.totalExpense = total;
    },
  },
});

export const expenseActions = expenseSlice.actions;

export default expenseSlice.reducer;
