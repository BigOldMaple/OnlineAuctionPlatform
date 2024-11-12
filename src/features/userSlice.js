/**
 * User Redux Slice
 * 
 * Manages authentication state and user data in Redux store.
 * Used with Auth0 for user authentication flow.
 * 
 * State:
 * - isAuthenticated: Login status
 * - user: User data from Auth0
 * - isLoading: Loading status
 * 
 * Actions:
 * - setUser: Sets user data on login
 * - clearUser: Clears data on logout
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Store user data and mark as authenticated
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    // Clear user data on logout
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
});

// Export actions
export const { setUser, clearUser } = userSlice.actions;

// Selectors for accessing user state
export const selectUser = (state) => state.user.user;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;

export default userSlice.reducer;