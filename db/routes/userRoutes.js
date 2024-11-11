// db/routes/userRoutes.js
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