// auctionController.js
// This file contains controller functions for managing auctions in the auction platform.
// These functions handle retrieving all auctions, retrieving specific auctions by ID or item ID, 
// creating new auctions, updating auctions, and deleting auctions. Each function interacts with 
// the auction model and handles HTTP responses.

import {
  getAllAuctions,
  getAuctionById as getAuctionByIdModel,
  getAuctionByItemId as getAuctionByItemIdModel,
  addAuction,
  updateAuctionById,
  deleteAuctionById
} from "../models/auctionModel.js";

// Get all auctions
const getAuctions = async (req, res) => {
  try {
    const auctions = await getAllAuctions();
    return res.status(200).json({
      success: true,
      data: auctions
    });
  } catch (error) {
    console.error('Error in getAuctions:', error);
    return res.status(500).json({
      error: 'Failed to retrieve auctions',
      message: error.message
    });
  }
};

// Get an auction by ID
const getAuction = async (req, res) => {
  try {
    const { id } = req.params;
    const auction = await getAuctionByIdModel(id);
    
    if (!auction) {
      return res.status(404).json({
        error: 'Auction not found',
        message: `No auction found with ID ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      data: auction
    });
  } catch (error) {
    console.error('Error in getAuction:', error);
    return res.status(500).json({
      error: 'Failed to retrieve auction',
      message: error.message
    });
  }
};

// Get auction by item ID
const getAuctionByItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const auction = await getAuctionByItemIdModel(itemId);
    
    if (!auction) {
      return res.status(404).json({
        error: 'Auction not found',
        message: `No auction found for item ${itemId}`
      });
    }

    return res.status(200).json({
      success: true,
      data: auction
    });
  } catch (error) {
    console.error('Error in getAuctionByItem:', error);
    return res.status(500).json({
      error: 'Failed to retrieve auction',
      message: error.message
    });
  }
};

// Create a new auction
const createAuction = async (req, res) => {
  try {
    const { item_id, start_time, end_time, current_bid } = req.body;

    if (!item_id || !start_time || !end_time || current_bid === undefined) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['item_id', 'start_time', 'end_time', 'current_bid'],
        received: Object.keys(req.body)
      });
    }

    const newAuction = await addAuction({
      item_id,
      start_time,
      end_time,
      current_bid
    });

    return res.status(201).json({
      success: true,
      data: newAuction,
      message: 'Auction created successfully'
    });
  } catch (error) {
    console.error('Error in createAuction:', error);
    return res.status(500).json({
      error: 'Failed to create auction',
      message: error.message
    });
  }
};

// Update an auction by ID
const updateAuction = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAuction = await updateAuctionById(id, req.body);
    
    if (!updatedAuction) {
      return res.status(404).json({
        error: 'Auction not found',
        message: `No auction found with ID ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedAuction,
      message: 'Auction updated successfully'
    });
  } catch (error) {
    console.error('Error in updateAuction:', error);
    return res.status(500).json({
      error: 'Failed to update auction',
      message: error.message
    });
  }
};

// Delete an auction by ID
const removeAuction = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteAuctionById(id);
    
    if (!deleted) {
      return res.status(404).json({
        error: 'Auction not found',
        message: `No auction found with ID ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Auction deleted successfully'
    });
  } catch (error) {
    console.error('Error in removeAuction:', error);
    return res.status(500).json({
      error: 'Failed to delete auction',
      message: error.message
    });
  }
};

export {
  getAuctions,
  getAuction,
  getAuctionByItem,
  createAuction,
  updateAuction,
  removeAuction
};