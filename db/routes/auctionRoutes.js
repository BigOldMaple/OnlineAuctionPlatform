import express from "express";
import {
  getAuctions,
  getAuction,
  createAuction,
  updateAuction,
  removeAuction,
} from "../controllers/auctionController.js";

const router = express.Router();

// Route to get all auctions
router.get("/", getAuctions);

// Route to get an auction by ID
router.get("/:id", getAuction);

// Route to create a new auction
router.post("/", createAuction);

// Route to update an auction by ID
router.put("/:id", updateAuction);

// Route to delete an auction by ID
router.delete("/:id", removeAuction);

export default router;
