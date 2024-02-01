import { createSlice } from "@reduxjs/toolkit";

const initiaExpenseState = { totalExpense: 0 };

const expenseSlice = createSlice({
  name: "expense",
  initialState: initiaExpenseState,
  reducers: {
    fullExpense(state, action) {
      state.totalExpense = action.payload;
      console.log(state.totalExpense);
    },
    addExpense(state, action) {
      state.totalExpense = state.totalExpense - action.payload;
    },
  },
});

export const expenseActions = expenseSlice.actions;

export default expenseSlice.reducer;
