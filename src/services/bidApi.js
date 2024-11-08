import axios from "axios";

export async function createBid(auctionId, userId, bidAmount) {
  const response = await axios.post("/api/bids", {
    auction_id: auctionId,
    user_id: userId,
    bid_amount: bidAmount,
  });
  return response.data;
}

export async function getBidsForAuction(auctionId) {
  const response = await axios.get(`/api/bids/${auctionId}`);
  return response.data;
}
