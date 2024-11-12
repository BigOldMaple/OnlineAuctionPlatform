// auctionRoutes.js
// Defines routes for managing auctions in the auction platform. These routes allow for retrieving
// all auctions, fetching an auction by its ID or associated item ID, creating new auctions, updating
// existing auctions, and deleting auctions.

import express from "express";
import {
  getAuctions,
  getAuction,
  getAuctionByItem,
  createAuction,
  updateAuction,
  removeAuction
} from "../controllers/auctionController.js";

const router = express.Router();

// Route to get all auctions
router.get("/", getAuctions);

// Route to get auction by item ID
router.get("/item/:itemId", getAuctionByItem);

// Route to get an auction by ID
router.get("/:id", getAuction);

// Route to create a new auction
router.post("/", createAuction);

// Route to update an auction by ID
router.put("/:id", updateAuction);

// Route to delete an auction by ID
router.delete("/:id", removeAuction);

export default router;