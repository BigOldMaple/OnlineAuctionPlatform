import {
  getBidsForAuction,
  getAllBids,
  getBidById,
  getBidsByUser,
  addBid,
  deleteBidById,
} from "../models/bidModel.js";

// Get all bids for an auction
async function getBidsByAuctionID(req, res) {
  try {
    const { auction_id } = req.params;
    const bids = await getBidsForAuction(auction_id);
    return res.status(200).json(bids);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to retrieve bids" });
  }
}

//Get all bids
async function getAllBidsController(req, res) {
  try {
    const bids = await getAllBids();

    if (bids.length > 0) {
      return res.status(200).json(bids);
    } else {
      return res.status(404).json({ message: "No bids found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to retrieve bids" });
  }
}

// Get a bid by ID
async function getBidByBidID(req, res) {
  try {
    const { id } = req.params;
    const bid = await getBidById(id);
    if (bid) {
      return res.status(200).json(bid);
    }
    return res.status(404).json({ message: "Bid not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to retrieve bid" });
  }
}

// Get all bids by a specific user
// controllers/bidController.js

async function getBidsByUserID(req, res) {
  try {
    const { user_id } = req.params;
    const bids = await getBidsByUser(user_id);

    if (bids.length > 0) {
      return res.status(200).json(bids);
    } else {
      return res.status(404).json({ message: "No bids found for this user" });
    }
  } catch (error) {
    console.error("Error in getBidsByUserID:", error);
    return res.status(500).json({ error: "Failed to retrieve bids" });
  }
}

// Place a new bid
async function createBid(req, res) {
  try {
    const { auction_id, user_id, bid_amount } = req.body;
    const newBid = { auction_id, user_id, bid_amount };

    const result = await addBid(newBid);
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to place bid" });
  }
}

// Delete a bid by ID
async function removeBid(req, res) {
  try {
    const { id } = req.params;
    const deleted = await deleteBidById(id);
    if (deleted) {
      return res.status(200).json({ message: "Bid deleted" });
    }
    return res.status(404).json({ message: "Bid not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete bid" });
  }
}

export {
  getBidsByAuctionID,
  getAllBidsController,
  getBidByBidID,
  getBidsByUserID,
  createBid,
  removeBid,
};
