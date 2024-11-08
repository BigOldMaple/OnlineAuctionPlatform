import db from "../db/db.js";

// Get all subscribers
const getAllUsers = async () => {
  const results = await db
    .select("*")
    .from("users")
    .orderBy([{ column: "firstname", order: "asc" }]);
  return results;
};

// Get a subscriber by ID
const getUserById = async (id) => {
  return await db("users").where({ id }).first();
};

// Add a new subscriber
const addUser = async (userData) => {
  const [id] = await db("users").insert(userData).returning("id");
  return { id };
};

// Delete a subscriber by ID
const deleteUserById = async (id) => {
  return await db("users").where({ id }).del();
};

export { getAllUsers, getUserById, addUser, deleteUserById };
