import {
    getUserWatchlist,
    addItemToWatchlist,
    removeItemFromWatchlist,
    isItemWatched
  } from "../models/watchlistModel.js";
  
  export const getWatchlist = async (req, res) => {
    try {
      const { userId } = req.params;
      console.log('Fetching watchlist for user:', userId);
  
      if (!userId) {
        return res.status(400).json({
          error: 'Missing user ID',
          message: 'User ID is required'
        });
      }
  
      const watchlist = await getUserWatchlist(userId);
      console.log('Retrieved watchlist:', watchlist);
  
      return res.status(200).json({
        success: true,
        data: watchlist
      });
    } catch (error) {
      console.error("Error in getWatchlist:", error);
      return res.status(500).json({
        error: 'Failed to retrieve watchlist',
        message: error.message
      });
    }
  };
  
  export const addToWatchlist = async (req, res) => {
    try {
      const { userId, itemId } = req.params;
      await addItemToWatchlist(userId, itemId);
      
      return res.status(200).json({
        success: true,
        message: 'Item added to watchlist'
      });
    } catch (error) {
      console.error("Error in addToWatchlist:", error);
      return res.status(500).json({
        error: 'Failed to add item to watchlist',
        message: error.message
      });
    }
  };
  
  export const removeFromWatchlist = async (req, res) => {
    try {
      const { userId, itemId } = req.params;
      await removeItemFromWatchlist(userId, itemId);
      
      return res.status(200).json({
        success: true,
        message: 'Item removed from watchlist'
      });
    } catch (error) {
      console.error("Error in removeFromWatchlist:", error);
      return res.status(500).json({
        error: 'Failed to remove item from watchlist',
        message: error.message
      });
    }
  };
  
  export const checkIfWatched = async (req, res) => {
    try {
      const { userId, itemId } = req.params;
      const isWatched = await isItemWatched(userId, itemId);
      
      return res.status(200).json({
        success: true,
        isWatched
      });
    } catch (error) {
      console.error("Error in checkIfWatched:", error);
      return res.status(500).json({
        error: 'Failed to check watchlist status',
        message: error.message
      });
    }
  };