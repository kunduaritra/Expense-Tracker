import { createSlice } from "@reduxjs/toolkit";

const initialState = { isDarkTheme: false, isPremiumActivated: false };

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.isDarkTheme = !state.isDarkTheme;
    },
    premiumActivate(state) {
      state.isDarkTheme = true;
      state.isPremiumActivated = true;
    },
  },
});

export const themeActions = themeSlice.actions;

export default themeSlice.reducer;
