// db/models/itemsModel.js
import db from "../db/db.js";

/**
 * Get all items from the database
 * @returns {Promise<Array>} Array of item objects
 */
const getAllItems = async () => {
  try {
    const items = await db("items")
      .select("*")
      .orderBy("created_at", "desc");
    return items;
  } catch (error) {
    console.error("Database error in getAllItems:", error);
    throw new Error(`Failed to retrieve items: ${error.message}`);
  }
};

/**
 * Get a single item by ID
 * @param {number} id - The item's ID
 * @returns {Promise<Object|null>} Item object or null if not found
 */
const getItemById = async (id) => {
  try {
    const item = await db("items")
      .select("*")
      .where({ id })
      .first();
    return item || null;
  } catch (error) {
    console.error("Database error in getItemById:", error);
    throw new Error(`Failed to retrieve item: ${error.message}`);
  }
};

/**
 * Add a new item to the database
 * @param {Object} itemData - The item data to insert
 * @returns {Promise<Object>} Created item object
 */
const addItem = async (itemData) => {
  const trx = await db.transaction();
  
  try {
    const [newItem] = await trx("items")
      .insert({
        name: itemData.name,
        description: itemData.description,
        starting_price: itemData.starting_price,
        image_url: itemData.image_url,
        created_at: trx.fn.now(),
        updated_at: trx.fn.now()
      })
      .returning("*");

    await trx.commit();
    return newItem;
  } catch (error) {
    await trx.rollback();
    console.error("Database error in addItem:", error);
    throw error;
  }
};

/**
 * Update an existing item
 * @param {number} id - The item's ID
 * @param {Object} itemData - The updated item data
 * @returns {Promise<Object|null>} Updated item object or null if not found
 */
const updateItem = async (id, itemData) => {
  const trx = await db.transaction();
  
  try {
    const [updatedItem] = await trx("items")
      .where({ id })
      .update({
        ...itemData,
        updated_at: trx.fn.now()
      })
      .returning("*");

    if (!updatedItem) {
      await trx.rollback();
      return null;
    }

    await trx.commit();
    return updatedItem;
  } catch (error) {
    await trx.rollback();
    console.error("Database error in updateItem:", error);
    throw error;
  }
};

/**
 * Delete an item by ID
 * @param {number} id - The item's ID
 * @returns {Promise<boolean>} True if item was deleted, false if item was not found
 */
const deleteItem = async (id) => {
  const trx = await db.transaction();
  
  try {
    const deleted = await trx("items")
      .where({ id })
      .del();

    await trx.commit();
    return deleted > 0;
  } catch (error) {
    await trx.rollback();
    console.error("Database error in deleteItem:", error);
    throw error;
  }
};

/**
 * Sync an item from external API data
 * @param {Object} itemData - The item data from external API
 * @returns {Promise<Object>} Synced item object
 */
const syncItem = async (itemData) => {
  const trx = await db.transaction();
  
  try {
    // Check if item exists
    const existingItem = await trx("items")
      .where({ id: itemData.id })
      .first();

    let syncedItem;

    if (existingItem) {
      // Update existing item
      [syncedItem] = await trx("items")
        .where({ id: itemData.id })
        .update({
          name: itemData.name,
          description: itemData.description,
          starting_price: itemData.starting_price,
          image_url: itemData.image_url,
          updated_at: trx.fn.now()
        })
        .returning("*");
    } else {
      // Create new item
      [syncedItem] = await trx("items")
        .insert({
          id: itemData.id,
          name: itemData.name,
          description: itemData.description,
          starting_price: itemData.starting_price,
          image_url: itemData.image_url,
          created_at: trx.fn.now(),
          updated_at: trx.fn.now()
        })
        .returning("*");
    }

    await trx.commit();
    return syncedItem;
  } catch (error) {
    await trx.rollback();
    console.error("Database error in syncItem:", error);
    throw error;
  }
};

/**
 * Get items by category
 * @param {string} category - The category to filter by
 * @returns {Promise<Array>} Array of items in the category
 */
const getItemsByCategory = async (category) => {
  try {
    const items = await db("items")
      .select("*")
      .whereRaw("LOWER(category) = LOWER(?)", [category])
      .orderBy("created_at", "desc");
    return items;
  } catch (error) {
    console.error("Database error in getItemsByCategory:", error);
    throw new Error(`Failed to retrieve items by category: ${error.message}`);
  }
};

/**
 * Search items by name or description
 * @param {string} searchTerm - The search term
 * @returns {Promise<Array>} Array of matching items
 */
const searchItems = async (searchTerm) => {
  try {
    const items = await db("items")
      .select("*")
      .where("name", "ilike", `%${searchTerm}%`)
      .orWhere("description", "ilike", `%${searchTerm}%`)
      .orderBy("created_at", "desc");
    return items;
  } catch (error) {
    console.error("Database error in searchItems:", error);
    throw new Error(`Failed to search items: ${error.message}`);
  }
};

/**
 * Get recently added items
 * @param {number} limit - Number of items to return
 * @returns {Promise<Array>} Array of recent items
 */
const getRecentItems = async (limit = 10) => {
  try {
    const items = await db("items")
      .select("*")
      .orderBy("created_at", "desc")
      .limit(limit);
    return items;
  } catch (error) {
    console.error("Database error in getRecentItems:", error);
    throw new Error(`Failed to retrieve recent items: ${error.message}`);
  }
};

export {
  getAllItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem,
  syncItem,
  getItemsByCategory,
  searchItems,
  getRecentItems
};