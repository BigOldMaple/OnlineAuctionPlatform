// watchlistController.js
// This module provides functions to manage a user's watchlist in the auction platform. 
// It includes methods to retrieve the watchlist, add or remove items, and check if a 
// specific item is being watched by the user.

import db from "../db/db.js";

// Function to get all items on a user's watchlist, including auction details if available
export const getUserWatchlist = async (userId) => {
  try {
    console.log('Querying watchlist for user:', userId);

    const watchlist = await db('watchlist')
      .join('items', 'watchlist.item_id', 'items.id')
      .leftJoin('auctions', 'items.id', 'auctions.item_id')
      .select(
        'watchlist.id',
        'items.id as item_id',
        'items.name',
        'items.description',
        'items.image_url',
        'auctions.current_bid',
        'auctions.end_time'
      )
      .where('watchlist.user_id', userId)
      .orderBy('watchlist.created_at', 'desc');

    console.log('Watchlist query result:', watchlist);
    return watchlist;
  } catch (error) {
    console.error("Database error in getUserWatchlist:", error);
    throw error;
  }
};

// Function to add an item to a user's watchlist
export const addItemToWatchlist = async (userId, itemId) => {
  const trx = await db.transaction();
  try {
    await trx('watchlist').insert({
      user_id: userId,
      item_id: itemId,
      created_at: trx.fn.now()
    });
    await trx.commit();
  } catch (error) {
    await trx.rollback();
    console.error("Database error in addItemToWatchlist:", error);
    throw error;
  }
};

// Function to remove an item from a user's watchlist
export const removeItemFromWatchlist = async (userId, itemId) => {
  const trx = await db.transaction();
  try {
    await trx('watchlist')
      .where({
        user_id: userId,
        item_id: itemId
      })
      .del();
    await trx.commit();
  } catch (error) {
    await trx.rollback();
    console.error("Database error in removeItemFromWatchlist:", error);
    throw error;
  }
};

// Function to check if a specific item is on the user's watchlist
export const isItemWatched = async (userId, itemId) => {
  try {
    const result = await db('watchlist')
      .where({
        user_id: userId,
        item_id: itemId
      })
      .first();
    return !!result;
  } catch (error) {
    console.error("Database error in isItemWatched:", error);
    throw error;
  }
};