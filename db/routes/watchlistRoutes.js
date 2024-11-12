// watchlistRoutes.js
// Defines routes for managing a user's watchlist in the auction platform. These routes allow 
// fetching the user's watchlist, adding items to the watchlist, removing items, and checking 
// if a specific item is on the watchlist.

import express from "express";
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkIfWatched
} from "../controllers/watchlistController.js";

const router = express.Router();

router.get("/:userId", getWatchlist);
router.post("/:userId/:itemId", addToWatchlist);
router.delete("/:userId/:itemId", removeFromWatchlist);
router.get("/:userId/:itemId/check", checkIfWatched);

export default router;