import express from "express";
import {
  getBidsByAuctionID,
  getAllBidsController,
  getBidByBidID,
  getBidsByUserID,
  createBid,
  removeBid,
} from "../controllers/bidController.js"; // Import controller functions

const router = express.Router();

// Route to get all bids for a specific auction
router.get("/auction/:auction_id", getBidsByAuctionID);

// Route to get all bids (no filters)
router.get("/", getAllBidsController);

// Route to get a bid by ID
router.get("/:id", getBidByBidID);

// Route to get all bids by a specific user
router.get("/user/:user_id", getBidsByUserID);

// Route to place a new bid
router.post("/", createBid);

// Route to delete a bid by ID
router.delete("/:id", removeBid);

export default router;
