// Import necessary modules
import bcrypt from "bcrypt";
import {
  getAllUsers,
  getUserById,
  addUser,
  deleteUserById,
} from "../models/userModel.js";

// Get all subscribers
async function getUsers(req, res) {
  try {
    const results = await getAllUsers();
    return res.status(200).json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Get a subscriber by ID
async function getUser(req, res) {
  try {
    const { id } = req.params;
    const User = await getUserById(id);
    if (User) {
      return res.status(200).json(User);
    }
    return res.status(404).json({ message: "Subscriber not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to retrieve subscriber" });
  }
}

// Create a new user
async function createUser(req, res) {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Use the addUser function to insert the user and get the new user’s ID
    const newUser = await addUser({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    // Respond with a success message and the new user’s ID
    res
      .status(201)
      .json({ message: "User created successfully", userId: newUser.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating user" });
  }
}

// Delete a subscriber by ID
async function removeUser(req, res) {
  try {
    const { id } = req.params;
    const deleted = await deleteUserById(id);
    if (deleted) {
      return res.status(200).json({ message: "Subscriber deleted" });
    }
    return res.status(404).json({ message: "Subscriber not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete subscriber" });
  }
}

// Export all functions
export { getUsers, getUser, createUser, removeUser };
