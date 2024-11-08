import {
  getAllAuctions,
  getAuctionById,
  addAuction,
  updateAuctionById,
  deleteAuctionById,
} from "../models/auctionModel.js";

// Get all auctions
async function getAuctions(req, res) {
  try {
    const auctions = await getAllAuctions();
    return res.status(200).json(auctions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to retrieve auctions" });
  }
}

// Get an auction by ID
async function getAuction(req, res) {
  try {
    const { id } = req.params;
    const auction = await getAuctionById(id);
    if (auction) {
      return res.status(200).json(auction);
    }
    return res.status(404).json({ message: "Auction not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to retrieve auction" });
  }
}

// Create a new auction
async function createAuction(req, res) {
  try {
    const { item_id, start_time, end_time, current_bid, highest_bid_user } =
      req.body;
    const newAuction = {
      item_id,
      start_time,
      end_time,
      current_bid,
      highest_bid_user,
    };

    const result = await addAuction(newAuction);
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create auction" });
  }
}

// Update an auction by ID
async function updateAuction(req, res) {
  try {
    const { id } = req.params;
    const updatedAuction = req.body;
    const result = await updateAuctionById(id, updatedAuction);
    if (result) {
      return res.status(200).json({ message: "Auction updated successfully" });
    }
    return res.status(404).json({ message: "Auction not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update auction" });
  }
}

// Delete an auction by ID
async function removeAuction(req, res) {
  try {
    const { id } = req.params;
    const deleted = await deleteAuctionById(id);
    if (deleted) {
      return res.status(200).json({ message: "Auction deleted" });
    }
    return res.status(404).json({ message: "Auction not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete auction" });
  }
}

export { getAuctions, getAuction, createAuction, updateAuction, removeAuction };
