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