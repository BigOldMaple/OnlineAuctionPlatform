// bidModel.js
// This module provides functions for managing bids in the auction platform. It includes methods
// to retrieve bids by user, auction, or bid ID, add new bids, delete bids, and get the highest bid
// for an auction. The functions ensure transactional integrity and provide bid-related data for 
// the auction process.
import db from "../db/db.js";

export const getBidsByUser = async (userId) => {
  try {
    const bids = await db('bids')
      .join('auctions', 'bids.auction_id', 'auctions.id')
      .join('items', 'auctions.item_id', 'items.id')
      .select(
        'bids.id',
        'bids.bid_amount',
        'bids.created_at',
        'auctions.id as auction_id',
        'auctions.end_time',
        'auctions.current_bid',
        'items.id as item_id',
        'items.name as item_name',
        'items.description as item_description',
        'items.image_url',
        db.raw('CASE WHEN auctions.highest_bid_user = ? THEN true ELSE false END as is_highest_bidder', [userId])
      )
      .where('bids.user_id', userId)
      .orderBy('bids.created_at', 'desc');

    // Add status to each bid
    const now = new Date();
    const bidsWithStatus = bids.map(bid => ({
      ...bid,
      status: new Date(bid.end_time) > now ? 'ongoing' : 'ended'
    }));

    return bidsWithStatus;
  } catch (error) {
    console.error('Database error in getBidsByUser:', error);
    throw new Error(`Failed to retrieve user bids: ${error.message}`);
  }
};

export const getBidsForAuction = async (auctionId) => {
  try {
    return await db('bids')
      .join('users', 'bids.user_id', 'users.id')
      .select(
        'bids.id',
        'bids.bid_amount',
        'bids.created_at',
        'users.firstname',
        'users.lastname',
        db.raw("CONCAT(LEFT(users.firstname, 1), '***', LEFT(users.lastname, 1)) as anonymous_name")
      )
      .where('auction_id', auctionId)
      .orderBy('bid_amount', 'desc');
  } catch (error) {
    console.error('Database error in getBidsForAuction:', error);
    throw new Error(`Failed to retrieve auction bids: ${error.message}`);
  }
};

export const getBidById = async (id) => {
  try {
    return await db('bids')
      .join('users', 'bids.user_id', 'users.id')
      .join('auctions', 'bids.auction_id', 'auctions.id')
      .select(
        'bids.*',
        'users.firstname',
        'users.lastname',
        'auctions.current_bid as auction_current_bid'
      )
      .where('bids.id', id)
      .first();
  } catch (error) {
    console.error('Database error in getBidById:', error);
    throw new Error(`Failed to retrieve bid: ${error.message}`);
  }
};

export const addBid = async (bidData) => {
  const trx = await db.transaction();
  
  try {
    // Create the bid
    const [newBid] = await trx('bids')
      .insert({
        auction_id: bidData.auction_id,
        user_id: bidData.user_id,
        bid_amount: bidData.bid_amount,
        created_at: trx.fn.now()
      })
      .returning('*');

    // Update the auction
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
    console.error('Database error in addBid:', error);
    throw error;
  }
};

export const deleteBid = async (id) => {
  const trx = await db.transaction();
  
  try {
    const bid = await trx('bids')
      .where('id', id)
      .first();

    if (!bid) {
      await trx.rollback();
      return false;
    }

    await trx('bids')
      .where('id', id)
      .del();

    const highestRemainingBid = await trx('bids')
      .where('auction_id', bid.auction_id)
      .orderBy('bid_amount', 'desc')
      .first();

    if (highestRemainingBid) {
      await trx('auctions')
        .where('id', bid.auction_id)
        .update({
          current_bid: highestRemainingBid.bid_amount,
          highest_bid_user: highestRemainingBid.user_id,
          updated_at: trx.fn.now()
        });
    }

    await trx.commit();
    return true;
  } catch (error) {
    await trx.rollback();
    console.error('Database error in deleteBid:', error);
    throw error;
  }
};

export const getHighestBid = async (auctionId) => {
  try {
    return await db('bids')
      .where('auction_id', auctionId)
      .orderBy('bid_amount', 'desc')
      .first();
  } catch (error) {
    console.error('Database error in getHighestBid:', error);
    throw error;
  }
};