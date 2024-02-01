import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authRedux";
import expenseReducer from "./expenseRedux";

const store = configureStore({
  reducer: { auth: authReducer, expense: expenseReducer },
});

export default store;
