import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authRedux";

const store = configureStore({
  reducer: { auth: authReducer },
});

export default store;
