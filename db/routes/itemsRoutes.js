// db/routes/itemsRoutes.js
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