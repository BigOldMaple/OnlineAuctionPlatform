/**
 * Auction Redux Slice
 * 
 * Manages auction listings in the Redux store.
 * 
 * State:
 * - list: Auction items array
 * - details: Selected item details
 * - status: Loading/success state
 */

import { createSlice } from "@reduxjs/toolkit";

const auctionSlice = createSlice({
  name: "auctions",
  initialState: { 
    list: [],        // Stores auction listings
    details: null,   // Current auction details
    status: null     // Track loading state
  },
  reducers: {
    // Populate store with auction data
    setMockData: (state, action) => {
      state.list = action.payload;
      state.status = "success";
    },
  },
});

// Export actions and reducer
export const { setMockData } = auctionSlice.actions;
export default auctionSlice.reducer;