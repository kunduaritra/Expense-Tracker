import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
  userEmail: localStorage.getItem("userEmail") || null,
  token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    login(state, actions) {
      state.userEmail = actions.payload.userEmail;
      state.token = actions.payload.idToken;
      state.isAuthenticated = true;

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", actions.payload.userEmail);
      localStorage.setItem("token", actions.payload.idToken);
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userEmail = null;
      state.token = null;

      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("token");
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
