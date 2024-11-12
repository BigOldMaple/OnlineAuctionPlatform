// bidController.js
// This file contains controller functions for managing bids in the auction platform.
// These functions handle retrieving bids by user, retrieving bids by auction, 
// creating new bids, deleting bids, and getting specific bid details. Each function
// interacts with the bid model and handles HTTP responses.

import { 
  getBidsByUser,
  getBidsForAuction,
  getBidById,
  addBid,
  deleteBid,
  getHighestBid
} from "../models/bidModel.js";

export const getBidsByUserID = async (req, res) => {
  try {
    const { user_id } = req.params;
    console.log('Fetching bids for user:', user_id);

    if (!user_id) {
      return res.status(400).json({
        error: 'Missing user ID',
        message: 'User ID is required'
      });
    }

    const bids = await getBidsByUser(user_id);
    console.log('Found bids:', bids);

    return res.status(200).json({
      success: true,
      data: bids
    });
  } catch (error) {
    console.error('Error in getBidsByUserID:', error);
    return res.status(500).json({
      error: 'Failed to retrieve bids',
      message: error.message
    });
  }
};

export const getBidsByAuctionID = async (req, res) => {
  try {
    const { auction_id } = req.params;
    const bids = await getBidsForAuction(auction_id);
    return res.status(200).json({
      success: true,
      data: bids
    });
  } catch (error) {
    console.error('Error in getBidsByAuctionID:', error);
    return res.status(500).json({
      error: 'Failed to retrieve auction bids',
      message: error.message
    });
  }
};

export const getBidByID = async (req, res) => {
  try {
    const { id } = req.params;
    const bid = await getBidById(id);
    
    if (!bid) {
      return res.status(404).json({
        error: 'Bid not found',
        message: `No bid found with ID ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      data: bid
    });
  } catch (error) {
    console.error('Error in getBidByID:', error);
    return res.status(500).json({
      error: 'Failed to retrieve bid',
      message: error.message
    });
  }
};

export const createBid = async (req, res) => {
  try {
    console.log('Received bid request:', {
      ...req.body,
      bid_amount: parseFloat(req.body.bid_amount).toFixed(2)
    });

    const { auction_id, user_id, bid_amount } = req.body;

    // Validate required fields
    if (!auction_id || !user_id || !bid_amount) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['auction_id', 'user_id', 'bid_amount'],
        received: req.body
      });
    }

    // Get current highest bid
    const highestBid = await getHighestBid(auction_id);
    const minimumBid = highestBid ? highestBid.bid_amount + 0.01 : 0;

    // Validate bid amount
    if (parseFloat(bid_amount) <= minimumBid) {
      return res.status(400).json({
        error: 'Bid too low',
        message: `Bid must be higher than ${minimumBid.toFixed(2)}`
      });
    }

    const newBid = await addBid({
      auction_id,
      user_id,
      bid_amount: parseFloat(bid_amount)
    });

    return res.status(201).json({
      success: true,
      data: newBid,
      message: 'Bid placed successfully'
    });
  } catch (error) {
    console.error('Bid creation error:', error);
    return res.status(500).json({
      error: 'Failed to place bid',
      message: error.message
    });
  }
};

export const deleteBidByID = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteBid(id);
    
    if (!deleted) {
      return res.status(404).json({
        error: 'Bid not found',
        message: `No bid found with ID ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Bid deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteBidByID:', error);
    return res.status(500).json({
      error: 'Failed to delete bid',
      message: error.message
    });
  }
};
