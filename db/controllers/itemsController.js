import {
  getAllItems,
  getItemById,
  addItem,
  updateItemById,
  deleteItemById,
} from "../models/itemsModel.js";

// Get all items
async function getItems(req, res) {
  try {
    const items = await getAllItems();
    return res.status(200).json(items);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to retrieve items" });
  }
}

// Get an item by ID
async function getItem(req, res) {
  try {
    const { id } = req.params;
    const item = await getItemById(id);
    if (item) {
      return res.status(200).json(item);
    }
    return res.status(404).json({ message: "Item not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to retrieve item" });
  }
}

// Add a new item
async function createItem(req, res) {
  try {
    const newItem = {
      name: req.body.name,
      description: req.body.description,
      starting_price: req.body.starting_price,
      image_url: req.body.image_url,
    };
    const result = await addItem(newItem);
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to add item" });
  }
}

// Update an item by ID
async function updateItem(req, res) {
  try {
    const { id } = req.params;
    const updatedItem = req.body;
    const result = await updateItemById(id, updatedItem);
    if (result) {
      return res.status(200).json({ message: "Item updated successfully" });
    }
    return res.status(404).json({ message: "Item not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update item" });
  }
}

// Delete an item by ID
async function removeItem(req, res) {
  try {
    const { id } = req.params;
    const deleted = await deleteItemById(id);
    if (deleted) {
      return res.status(200).json({ message: "Item deleted" });
    }
    return res.status(404).json({ message: "Item not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete item" });
  }
}

export { getItems, getItem, createItem, updateItem, removeItem };
