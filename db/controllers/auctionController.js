import {
  getAllAuctions,
  getAuctionById,
  getAuctionByItemId as getAuctionByItem,
  addAuction,
  updateAuctionById,
  deleteAuctionById,
} from "../models/auctionModel.js";

// Existing controllers remain the same...

// Add new controller for getting auction by item ID
export const getAuctionByItemId = async (req, res) => {
  try {
    console.log('Fetching auction for item:', req.params.itemId);
    const { itemId } = req.params;
    const auction = await getAuctionByItem(itemId);
    
    if (auction) {
      return res.status(200).json({
        success: true,
        data: auction
      });
    }
    
    return res.status(404).json({
      error: 'Auction not found',
      message: 'No auction exists for this item'
    });
  } catch (error) {
    console.error('Error in getAuctionByItemId:', error);
    return res.status(500).json({
      error: 'Failed to retrieve auction',
      message: error.message
    });
  }
};

// Update the createAuction controller to handle item-based creation
export const createAuction = async (req, res) => {
  try {
    console.log('Creating auction with data:', req.body);
    const { item_id, start_time, end_time, current_bid } = req.body;

    // Validate required fields
    if (!item_id || !start_time || !end_time || current_bid === undefined) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['item_id', 'start_time', 'end_time', 'current_bid'],
        received: Object.keys(req.body)
      });
    }

    // Check if auction already exists for this item
    const existingAuction = await getAuctionByItem(item_id);
    if (existingAuction) {
      return res.status(409).json({
        error: 'Auction already exists',
        message: 'An auction already exists for this item',
        data: existingAuction
      });
    }

    const newAuction = {
      item_id,
      start_time,
      end_time,
      current_bid,
    };

    const result = await addAuction(newAuction);
    console.log('Auction created:', result);

    return res.status(201).json({
      success: true,
      data: result,
      message: 'Auction created successfully'
    });
  } catch (error) {
    console.error('Error creating auction:', error);
    return res.status(500).json({
      error: 'Failed to create auction',
      message: error.message
    });
  }
};

// Existing controller exports remain the same...
export {
  getAuctions,
  getAuction,
  updateAuction,
  removeAuction,
};