import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  removeUser,
} from "../controllers/userController.js";

const router = express.Router();

// Route to get all subscribers
router.get("/", getUsers);

// Route to get a subscriber by ID
router.get("/:id", getUser);

// Route to add a new subscriber
router.post("/", createUser);

// Route to delete a subscriber by ID
router.delete("/:id", removeUser);

export default router;
