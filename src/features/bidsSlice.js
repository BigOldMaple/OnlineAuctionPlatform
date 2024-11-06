// src/features/bidsSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

const initialState = {
  bids: [], // Track bids placed on auction items
};

const bidsSlice = createSlice({
  name: 'bids',
  initialState,
  reducers: {
    placeBid: (state, action) => {
      const { itemId, bidAmount } = action.payload;
      const existingBid = state.bids.find(bid => bid.itemId === itemId);

      if (existingBid) {
        existingBid.amount = bidAmount; // Update bid if it exists
      } else {
        state.bids.push({ itemId, amount: bidAmount });
      }
    },
  },
});

export const { placeBid } = bidsSlice.actions;

export const selectBiddedItems = createSelector(
  (state) => state.bids?.bids || [],
  (bids) => bids
);

export default bidsSlice.reducer;
