/**
 * BidForm Component
 * 
 * This component allows users to place a bid on an auction item. It provides an input field 
 * for entering the bid amount and a button to submit the bid. When submitted, the bid amount 
 * is sent to the backend API via an axios POST request, and toast notifications inform the 
 * user of the success or failure of the bid placement.
 * 
 * Props:
 * - auctionId: The unique identifier for the auction item the bid is being placed on.
 * 
 * State:
 * - bidAmount: The value entered by the user for their bid.
 * 
 * Usage:
 * <BidForm auctionId={auctionId} />
 * 
 * Dependencies:
 * - axios: For making HTTP requests to the backend API.
 * - react-toastify: For displaying success and error notifications.
 */
import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

function BidForm({ auctionId }) {
  const [bidAmount, setBidAmount] = useState("");

  const placeBid = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/auction/${auctionId}/bid`, { amount: bidAmount });
      toast.success("Bid placed successfully!");
    } catch (error) {
      toast.error("Failed to place bid.");
    }
  };

  return (
    <form onSubmit={placeBid} className="mt-4">
      <input
        type="number"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        placeholder="Enter your bid"
        className="border p-2 mr-2"
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2">
        Place Bid
      </button>
    </form>
  );
}

export default BidForm;
