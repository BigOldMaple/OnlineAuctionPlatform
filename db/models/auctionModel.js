import db from "../db/db.js";

// Get all auctions
const getAllAuctions = async () => {
  return await db("auctions")
    .join("items", "auctions.item_id", "items.id")
    .select("auctions.*", "items.name as item_name")
    .orderBy("start_time", "asc");
};

// Get an auction by ID
const getAuctionById = async (id) => {
  return await db("auctions")
    .join("items", "auctions.item_id", "items.id")
    .select("auctions.*", "items.name as item_name")
    .where("auctions.id", id)
    .first();
};

// Add a new auction
const addAuction = async (auctionData) => {
  const [id] = await db("auctions").insert(auctionData).returning("id");
  return { id };
};

// Update an auction by ID
const updateAuctionById = async (id, auctionData) => {
  return await db("auctions").where({ id }).update(auctionData);
};

// Delete an auction by ID
const deleteAuctionById = async (id) => {
  return await db("auctions").where({ id }).del();
};

export {
  getAllAuctions,
  getAuctionById,
  addAuction,
  updateAuctionById,
  deleteAuctionById,
};
