// userRoutes.js
// Defines routes for managing users in the auction platform. These routes handle user retrieval,
// creation, deletion, and integration with Auth0 for authentication. Each route corresponds to 
// a controller function in `userController.js`.

import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  removeUser,
  handleAuth0User,
  getAuth0User
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", createUser);
router.delete("/:id", removeUser);
router.post("/auth0", handleAuth0User);
router.get("/auth0/:auth0Id", getAuth0User);

export default router;