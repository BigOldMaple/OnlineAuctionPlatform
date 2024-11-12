import express from "express";
import { 
  getBidsByUserID, 
  createBid, 
  getBidsByAuctionID,
  getBidByID,
  deleteBidByID
} from "../controllers/bidController.js";

const router = express.Router();

// Get all bids for a specific user
router.get("/user/:user_id", getBidsByUserID);

// Get all bids for a specific auction
router.get("/auction/:auction_id", getBidsByAuctionID);

// Get a specific bid
router.get("/:id", getBidByID);

// Place a new bid
router.post("/", createBid);

// Delete a bid
router.delete("/:id", deleteBidByID);

export default router;