// auctionModel.js
// This module provides functions for managing auctions in the database. It includes methods for 
// retrieving all auctions, fetching auctions by specific criteria (ID or item ID), creating new 
// auctions, updating existing auctions, deleting auctions, and retrieving active (ongoing) auctions.

import db from "../db/db.js";

/**
 * Get all auctions with related item information
 * @returns {Promise<Array>} Array of auctions with item details
 */
const getAllAuctions = async () => {
  try {
    return await db("auctions")
      .join("items", "auctions.item_id", "items.id")
      .select(
        "auctions.*",
        "items.name as item_name",
        "items.description as item_description",
        "items.image_url"
      )
      .orderBy("start_time", "asc");
  } catch (error) {
    console.error("Database error in getAllAuctions:", error);
    throw new Error(`Failed to retrieve auctions: ${error.message}`);
  }
};

/**
 * Get an auction by its ID
 * @param {number} id - The auction's ID
 * @returns {Promise<Object|null>} Auction object with item details or null if not found
 */
const getAuctionById = async (id) => {
  try {
    return await db("auctions")
      .join("items", "auctions.item_id", "items.id")
      .select(
        "auctions.*",
        "items.name as item_name",
        "items.description as item_description",
        "items.image_url"
      )
      .where("auctions.id", id)
      .first();
  } catch (error) {
    console.error("Database error in getAuctionById:", error);
    throw new Error(`Failed to retrieve auction: ${error.message}`);
  }
};

/**
 * Get an auction by item ID
 * @param {number} itemId - The item's ID
 * @returns {Promise<Object|null>} Auction object with item details or null if not found
 */
const getAuctionByItemId = async (itemId) => {
  try {
    return await db("auctions")
      .select(
        "auctions.*",
        "items.name as item_name",
        "items.description as item_description",
        "items.image_url"
      )
      .leftJoin("items", "auctions.item_id", "items.id")
      .where("auctions.item_id", itemId)
      .first();
  } catch (error) {
    console.error("Database error in getAuctionByItemId:", error);
    throw new Error(`Failed to retrieve auction for item: ${error.message}`);
  }
};

/**
 * Add a new auction
 * @param {Object} auctionData - The auction data to insert
 * @returns {Promise<Object>} Created auction object with full details
 */
const addAuction = async (auctionData) => {
  const trx = await db.transaction();
  
  try {
    // Check if item exists
    const item = await trx("items")
      .where({ id: auctionData.item_id })
      .first();

    if (!item) {
      throw new Error(`Item with ID ${auctionData.item_id} not found`);
    }

    // Check if auction already exists for this item
    const existingAuction = await trx("auctions")
      .where({ item_id: auctionData.item_id })
      .first();

    if (existingAuction) {
      throw new Error(`Auction already exists for item ${auctionData.item_id}`);
    }

    // Create the auction
    const [newAuction] = await trx("auctions")
      .insert({
        item_id: auctionData.item_id,
        start_time: auctionData.start_time,
        end_time: auctionData.end_time,
        current_bid: auctionData.current_bid || item.starting_price,
        created_at: trx.fn.now(),
        updated_at: trx.fn.now()
      })
      .returning("*");

    await trx.commit();

    // Return auction with item details
    return await db("auctions")
      .select(
        "auctions.*",
        "items.name as item_name",
        "items.description as item_description",
        "items.image_url"
      )
      .leftJoin("items", "auctions.item_id", "items.id")
      .where("auctions.id", newAuction.id)
      .first();
  } catch (error) {
    await trx.rollback();
    console.error("Database error in addAuction:", error);
    throw error;
  }
};

/**
 * Update an auction by ID
 * @param {number} id - The auction's ID
 * @param {Object} auctionData - The updated auction data
 * @returns {Promise<Object>} Updated auction object
 */
const updateAuctionById = async (id, auctionData) => {
  const trx = await db.transaction();
  
  try {
    console.log('Updating auction in database:', {
      auctionId: id,
      updateData: auctionData
    });

    // Check if auction exists
    const existingAuction = await trx("auctions")
      .where({ id })
      .first();

    if (!existingAuction) {
      await trx.rollback();
      return null;
    }

    // Update the auction
    const [updatedAuction] = await trx("auctions")
      .where({ id })
      .update({
        ...auctionData,
        updated_at: trx.fn.now()
      })
      .returning("*");

    await trx.commit();

    // Return updated auction with item details
    return await db("auctions")
      .select(
        "auctions.*",
        "items.name as item_name",
        "items.description as item_description",
        "items.image_url"
      )
      .leftJoin("items", "auctions.item_id", "items.id")
      .where("auctions.id", updatedAuction.id)
      .first();
  } catch (error) {
    await trx.rollback();
    console.error("Database error in updateAuctionById:", error);
    throw error;
  }
};

/**
 * Delete an auction by ID
 * @param {number} id - The auction's ID
 * @returns {Promise<boolean>} True if auction was deleted, false if auction was not found
 */
const deleteAuctionById = async (id) => {
  const trx = await db.transaction();
  
  try {
    const deleted = await trx("auctions").where({ id }).del();
    await trx.commit();
    return deleted > 0;
  } catch (error) {
    await trx.rollback();
    console.error("Database error in deleteAuctionById:", error);
    throw error;
  }
};

/**
 * Get active auctions (not ended)
 * @returns {Promise<Array>} Array of active auctions with item details
 */
const getActiveAuctions = async () => {
  try {
    return await db("auctions")
      .join("items", "auctions.item_id", "items.id")
      .select(
        "auctions.*",
        "items.name as item_name",
        "items.description as item_description",
        "items.image_url"
      )
      .where("end_time", ">", db.fn.now())
      .orderBy("end_time", "asc");
  } catch (error) {
    console.error("Database error in getActiveAuctions:", error);
    throw new Error(`Failed to retrieve active auctions: ${error.message}`);
  }
};

export {
  getAllAuctions,
  getAuctionById,
  getAuctionByItemId,
  addAuction,
  updateAuctionById,
  deleteAuctionById,
  getActiveAuctions
};