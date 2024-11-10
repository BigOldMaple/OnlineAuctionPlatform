// db/routes/userRoutes.js
import express from "express";
import {
  getUsers,
  getUser,
  addNewUser,
  removeUser,
  handleAuth0User,
  getAuth0User
} from "../controllers/userController.js";

const router = express.Router();

// Existing routes
router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", addNewUser);
router.delete("/:id", removeUser);

// Auth0 routes
router.post("/auth0", handleAuth0User);
router.get("/auth0/:auth0Id", getAuth0User);

export default router;