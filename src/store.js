// src/store.js

import { configureStore } from '@reduxjs/toolkit';
import bidsReducer from './features/bidsSlice';

const store = configureStore({
  reducer: {
    bids: bidsReducer, // Renamed to 'bids' for tracking bid items
  },
});

export default store;
