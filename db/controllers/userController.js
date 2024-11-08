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

// Add a new subscriber
async function createUser(req, res) {
  try {
    // Map request body to match database column names
    const newUser = {
      firstname: req.body.firstname, // lowercase to match DB column
      lastname: req.body.lastname,
      email: req.body.email,
    };

    const result = await addUser(newUser);
    return res.status(201).json(result);
  } catch (error) {
    console.error(error); // Check this log in your backend console for details
    return res.status(500).json({ error: "Failed to add subscriber" });
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

export { getUsers, getUser, createUser, removeUser };
