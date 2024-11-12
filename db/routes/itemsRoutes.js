// itemsRoutes.js
// Defines routes for managing items in the auction platform. These routes allow retrieving all items 
// or a specific item, creating new items, updating or deleting an item by ID, and syncing item data 
// with an external source.

import express from "express";
import {
  getItems,
  getItem,
  createItem,
  updateItemById,
  deleteItemById,
  syncItem
} from "../controllers/itemsController.js";

const router = express.Router();

router.get("/", getItems);
router.get("/:id", getItem);
router.post("/", createItem);
router.post("/sync", syncItem);
router.put("/:id", updateItemById);
router.delete("/:id", deleteItemById);

export default router;