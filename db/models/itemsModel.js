import db from "../db/db.js";

// Get all items
const getAllItems = async () => {
  return await db("items").orderBy("name", "asc");
};

// Get an item by ID
const getItemById = async (id) => {
  return await db("items").where({ id }).first();
};

// Add a new item
const addItem = async (itemData) => {
  const [id] = await db("items").insert(itemData).returning("id");
  return { id };
};

// Update an item by ID
const updateItemById = async (id, itemData) => {
  return await db("items").where({ id }).update(itemData);
};

// Delete an item by ID
const deleteItemById = async (id) => {
  return await db("items").where({ id }).del();
};

export { getAllItems, getItemById, addItem, updateItemById, deleteItemById };
