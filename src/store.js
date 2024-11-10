// src/store.js

import { configureStore } from "@reduxjs/toolkit";
import bidsReducer from "./features/bidsSlice";
import userReducer from "./features/userSlice";

const store = configureStore({
  reducer: {
    bids: bidsReducer,
    user: userReducer,
  },
});

export default store;
