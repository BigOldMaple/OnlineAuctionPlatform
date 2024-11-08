// src/store.js

import { configureStore } from "@reduxjs/toolkit";
import bidsReducer from "./features/bidsSlice";
import userReducer from "./features/userSlice";

const store = configureStore({
  reducer: {
    bids: bidsReducer, // Renamed to 'bids' for tracking bid items
    user: userReducer,
  },
});

export default store;
