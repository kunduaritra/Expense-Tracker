import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authRedux";
import expenseReducer from "./expenseRedux";
import themeReducer from "./themeRedux";

const store = configureStore({
  reducer: { auth: authReducer, expense: expenseReducer, theme: themeReducer },
});

export default store;
