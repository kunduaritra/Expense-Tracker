import { createSlice } from "@reduxjs/toolkit";

const initialState = { isAuthenticated: false };

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    login(state, actions) {
      localStorage.setItem("token", actions.payload);
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
