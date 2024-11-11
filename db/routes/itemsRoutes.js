// db/routes/itemsRoutes.js
import express from "express";
import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  syncItem
} from "../controllers/itemsController.js";

const router = express.Router();

// Get all items
router.get("/", getItems);

// Get single item by ID
router.get("/:id", getItem);

// Create new item
router.post("/", createItem);

// Sync item from external API
router.post("/sync", syncItem);

// Update item
router.put("/:id", updateItem);

// Delete item
router.delete("/:id", deleteItem);

export default router;