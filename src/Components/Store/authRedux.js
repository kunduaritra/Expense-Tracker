import { createSlice } from "@reduxjs/toolkit";

const initialState = { isAuthenticated: false, userEmail: null, token: null };

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    login(state, actions) {
      state.userEmail = actions.payload.userEmail;
      state.token = actions.payload.idToken;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userEmail = null;
      state.token = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
