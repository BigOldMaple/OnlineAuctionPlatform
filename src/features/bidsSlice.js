/**
 * Bids Redux Slice
 * 
 * Manages auction bids in Redux store.
 * Tracks bid history and allows bid updates.
 * 
 * State:
 * - bids: Array of user's bids on items
 *   [{ itemId, amount }]
 * 
 * Features:
 * - Place/update bids
 * - Track bid history
 * - Memoized bid selection
 */

import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

const initialState = {
  bids: [], // Stores bid history
};

const bidsSlice = createSlice({
  name: 'bids',
  initialState,
  reducers: {
    // Place new bid or update existing one
    placeBid: (state, action) => {
      const { itemId, bidAmount } = action.payload;
      const existingBid = state.bids.find(bid => bid.itemId === itemId);

      if (existingBid) {
        existingBid.amount = bidAmount; // Update existing bid
      } else {
        state.bids.push({ itemId, amount: bidAmount }); // Add new bid
      }
    },
  },
});

// Export actions
export const { placeBid } = bidsSlice.actions;

// Memoized selector for bid data
export const selectBiddedItems = createSelector(
  (state) => state.bids?.bids || [], // Input selector
  (bids) => bids                     // Output selector
);

export default bidsSlice.reducer;