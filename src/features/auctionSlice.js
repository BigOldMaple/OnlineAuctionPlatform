/**
 * Auction Slice
 *
 * Manages auction items in the Redux store.
 *
 * Initial State:
 * - **list**: Array of auction items.
 * - **details**: Placeholder for item details.
 * - **status**: Tracks data loading status.
 *
 * Reducers:
 * - **setMockData**: Populates `list` with mock data for testing and sets `status` to `"success"`.
 *
 * Exports:
 * - **setMockData**: Action to load mock auction items.
 * - **auctionSlice.reducer**: The reducer to include in the Redux store.
 */

import { createSlice } from "@reduxjs/toolkit";

// Mock data for testing without a backend
// const mockAuctions = [
//   { id: 1, title: "Vintage Painting", description: "A beautiful vintage painting.", currentBid: 120 },
//   { id: 2, title: "Antique Vase", description: "A rare antique vase from the Ming dynasty.", currentBid: 300 },
//   { id: 3, title: "Classic Car Model", description: "A model of a classic 1967 Mustang.", currentBid: 500 },
// ];

const auctionSlice = createSlice({
  name: "auctions",
  initialState: { list: [], details: null, status: null },
  reducers: {
    setMockData: (state, action) => {
      state.list = action.payload;
      state.status = "success";
    },
  },
});

export const { setMockData } = auctionSlice.actions;

export default auctionSlice.reducer;
