// src/pages/BiddedItemsPage.jsx

import React from "react";
import { useSelector } from "react-redux";
import { selectBiddedItems } from "../features/bidsSlice";

function BiddedItemsPage() {
  const biddedItems = useSelector(selectBiddedItems);
  const itemCount = biddedItems.length;
  const totalBidAmount = biddedItems.reduce((total, bid) => total + bid.amount, 0);

  return (
    <div className="container mx-auto p-6 text-white">
      <h2 className="text-4xl font-bold mb-6">Current Bidded Items</h2>

      {biddedItems.length > 0 ? (
        <div className="space-y-4">
          {biddedItems.map((bid) => (
            <div key={bid.itemId} className="p-4 border border-gray-700 rounded-lg shadow-md bg-gray-800">
              <h3 className="text-xl font-semibold">Item ID: {bid.itemId}</h3>
              <p>Your Bid: £{bid.amount.toFixed(2)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>You have not placed any bids. Place bids on items to see them here.</p>
      )}

      {/* Bidded Summary Section */}
      <div className="mt-8 p-6 rounded-lg bg-gray-700 text-white shadow-md">
        <div className="flex justify-between mb-2">
          <p>Items Bidded ({itemCount})</p>
          <p>£{totalBidAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default BiddedItemsPage;
