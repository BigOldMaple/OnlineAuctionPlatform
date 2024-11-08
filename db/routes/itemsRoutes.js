import express from "express";
import {
  getItems,
  getItem,
  createItem,
  updateItem,
  removeItem,
} from "../controllers/itemsController.js";

const router = express.Router();

// Route to get all items
router.get("/", getItems);

// Route to get an item by ID
router.get("/:id", getItem);

// Route to add a new item
router.post("/", createItem);

// Route to update an item by ID
router.put("/:id", updateItem);

// Route to delete an item by ID
router.delete("/:id", removeItem);

export default router;
