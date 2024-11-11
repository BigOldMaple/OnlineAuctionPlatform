// db/models/bidModel.js
import db from "../db/db.js";

/**
 * Get all bids for a specific auction
 * @param {number} auction_id - The auction's ID
 * @returns {Promise<Array>} Array of bids with user information
 */
export const getBidsForAuction = async (auction_id) => {
  try {
    const bids = await db("bids")
      .join("users", "bids.user_id", "users.id")
      .select(
        "bids.id",
        "bids.bid_amount",
        "bids.created_at",
        "users.firstname",
        "users.lastname",
        "users.email"
      )
      .where("bids.auction_id", auction_id)
      .orderBy("bids.created_at", "desc");

    return bids;
  } catch (error) {
    console.error("Database error in getBidsForAuction:", error);
    throw new Error(`Failed to retrieve bids for auction: ${error.message}`);
  }
};

/**
 * Get all bids
 * @returns {Promise<Array>} Array of all bids with related information
 */
export const getAllBids = async () => {
  try {
    const bids = await db("bids")
      .join("auctions", "bids.auction_id", "auctions.id")
      .join("users", "bids.user_id", "users.id")
      .join("items", "auctions.item_id", "items.id")
      .select(
        "bids.id as bid_id",
        "bids.bid_amount",
        "bids.created_at",
        "users.firstname",
        "users.lastname",
        "users.email",
        "items.name as item_name",
        "items.description as item_description",
        "auctions.start_time",
        "auctions.end_time",
        "auctions.current_bid"
      )
      .orderBy("bids.created_at", "desc");

    return bids;
  } catch (error) {
    console.error("Database error in getAllBids:", error);
    throw new Error(`Failed to retrieve all bids: ${error.message}`);
  }
};

/**
 * Get a specific bid by ID
 * @param {number} id - The bid's ID
 * @returns {Promise<Object|null>} Bid object with user information or null if not found
 */
export const getBidById = async (id) => {
  try {
    const bid = await db("bids")
      .join("users", "bids.user_id", "users.id")
      .join("auctions", "bids.auction_id", "auctions.id")
      .join("items", "auctions.item_id", "items.id")
      .select(
        "bids.*",
        "users.firstname",
        "users.lastname",
        "users.email",
        "items.name as item_name",
        "auctions.current_bid as auction_current_bid"
      )
      .where("bids.id", id)
      .first();

    return bid;
  } catch (error) {
    console.error("Database error in getBidById:", error);
    throw new Error(`Failed to retrieve bid: ${error.message}`);
  }
};

/**
 * Get all bids for a specific user
 * @param {number} user_id - The user's ID
 * @returns {Promise<Array>} Array of user's bids with auction information
 */
export const getBidsByUser = async (user_id) => {
  try {
    const bids = await db("bids")
      .join("auctions", "bids.auction_id", "auctions.id")
      .join("items", "auctions.item_id", "items.id")
      .select(
        "bids.id as bid_id",
        "bids.bid_amount",
        "bids.created_at",
        "items.name as item_name",
        "items.description as item_description",
        "auctions.start_time",
        "auctions.end_time",
        "auctions.current_bid",
        db.raw("CASE WHEN auctions.highest_bid_user = ? THEN true ELSE false END as is_highest_bidder", [user_id])
      )
      .where("bids.user_id", user_id)
      .orderBy("bids.created_at", "desc");

    return bids;
  } catch (error) {
    console.error("Database error in getBidsByUser:", error);
    throw new Error(`Failed to retrieve user bids: ${error.message}`);
  }
};

/**
 * Add a new bid
 * @param {Object} bidData - Bid information
 * @returns {Promise<Object>} Created bid object
 */
// db/models/bidModel.js

export const addBid = async (bidData) => {
  console.log('Adding bid with data:', bidData);

  const trx = await db.transaction();
  
  try {
    // Verify auction exists and get current state
    const auction = await trx('auctions')
      .where('id', bidData.auction_id)
      .first();

    if (!auction) {
      throw new Error(`Auction with ID ${bidData.auction_id} not found`);
    }

    console.log('Current auction state:', auction);

    // Verify user exists
    const user = await trx('users')
      .where('id', bidData.user_id)
      .first();

    if (!user) {
      throw new Error(`User with ID ${bidData.user_id} not found`);
    }

    console.log('Found user:', user);

    // Insert the bid
    const [newBid] = await trx('bids')
      .insert({
        auction_id: bidData.auction_id,
        user_id: bidData.user_id,
        bid_amount: bidData.bid_amount,
        created_at: trx.fn.now()
      })
      .returning('*');

    console.log('Created bid:', newBid);

    // Update auction
    await trx('auctions')
      .where('id', bidData.auction_id)
      .update({
        current_bid: bidData.bid_amount,
        highest_bid_user: bidData.user_id,
        updated_at: trx.fn.now()
      });

    await trx.commit();

    // Return complete bid data
    return await db('bids')
      .join('users', 'bids.user_id', 'users.id')
      .join('auctions', 'bids.auction_id', 'auctions.id')
      .select(
        'bids.*',
        'users.firstname',
        'users.lastname',
        'auctions.current_bid as auction_current_bid'
      )
      .where('bids.id', newBid.id)
      .first();

  } catch (error) {
    await trx.rollback();
    console.error('Error in addBid:', error);
    throw error;
  }
};

/**
 * Delete a bid by ID
 * @param {number} id - The bid's ID
 * @returns {Promise<boolean>} True if bid was deleted, false if bid was not found
 */
export const deleteBidById = async (id) => {
  const trx = await db.transaction();
  
  try {
    // Get bid information before deleting
    const bid = await trx("bids")
      .where("id", id)
      .first();

    if (!bid) {
      await trx.rollback();
      return false;
    }

    // Delete the bid
    await trx("bids")
      .where("id", id)
      .del();

    // If this was the highest bid, update the auction with the next highest bid
    const highestRemainingBid = await trx("bids")
      .where("auction_id", bid.auction_id)
      .orderBy("bid_amount", "desc")
      .first();

    if (highestRemainingBid) {
      await trx("auctions")
        .where("id", bid.auction_id)
        .update({
          current_bid: highestRemainingBid.bid_amount,
          highest_bid_user: highestRemainingBid.user_id
        });
    } else {
      // If no bids remain, reset to starting conditions
      await trx("auctions")
        .where("id", bid.auction_id)
        .update({
          current_bid: 0,
          highest_bid_user: null
        });
    }

    await trx.commit();
    return true;
  } catch (error) {
    await trx.rollback();
    console.error("Database error in deleteBidById:", error);
    throw new Error(`Failed to delete bid: ${error.message}`);
  }
};

/**
 * Get the highest bid for an auction
 * @param {number} auction_id - The auction's ID
 * @returns {Promise<Object|null>} Highest bid object or null if no bids
 */
export const getHighestBid = async (auction_id) => {
  try {
    const highestBid = await db("bids")
      .join("users", "bids.user_id", "users.id")
      .select(
        "bids.*",
        "users.firstname",
        "users.lastname"
      )
      .where("auction_id", auction_id)
      .orderBy("bid_amount", "desc")
      .first();

    return highestBid;
  } catch (error) {
    console.error("Database error in getHighestBid:", error);
    throw new Error(`Failed to retrieve highest bid: ${error.message}`);
  }
};