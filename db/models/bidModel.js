import db from "../db/db.js";

// Get all bids for an auction
const getBidsForAuction = async (auction_id) => {
  return await db("bids")
    .join("users", "bids.user_id", "users.id")
    .select("bids.*", "users.firstname", "users.lastname")
    .where("bids.auction_id", auction_id)
    .orderBy("bids.created_at", "asc");
};

// Get all bids
async function getAllBids() {
  try {
    const bids = await db("bids")
      .join("auctions", "bids.auction_id", "auctions.id")
      .join("items", "auctions.item_id", "items.id") // Joining the items table to get item details
      .join("users", "bids.user_id", "users.id")
      .select(
        "bids.id as bid_id", // Renaming for clarity in the response
        "bids.bid_amount",
        "bids.created_at",
        "items.name as item_name", // Selecting the item name from items table
        "auctions.start_time",
        "auctions.end_time",
        "users.firstname",
        "users.lastname"
      )
      .orderBy("bids.created_at", "desc");

    return bids;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to retrieve all bids");
  }
}

// Get a bid by ID
const getBidById = async (id) => {
  return await db("bids")
    .join("users", "bids.user_id", "users.id")
    .select("bids.*", "users.firstname", "users.lastname")
    .where("bids.id", id)
    .first();
};

// Get all bids by a specific user
// models/bidModel.js
async function getBidsByUser(user_id) {
  try {
    const bids = await db("bids")
      .join("auctions", "bids.auction_id", "auctions.id")
      .join("items", "auctions.item_id", "items.id")
      .join("users", "bids.user_id", "users.id")
      .select(
        "bids.id as bid_id",
        "bids.bid_amount",
        "bids.created_at",
        "items.name as item_name",
        "auctions.start_time",
        "auctions.end_time",
        "users.firstname",
        "users.lastname"
      )
      .where("bids.user_id", user_id)
      .orderBy("bids.created_at", "desc");

    return bids;
  } catch (error) {
    console.error("Error in getBidsByUser:", error);
    throw new Error("Failed to retrieve bids for the specified user");
  }
}

// Place a new bid
const addBid = async (bidData) => {
  const [id] = await db("bids").insert(bidData).returning("id");
  return { id };
};

// Delete a bid by ID
const deleteBidById = async (id) => {
  return await db("bids").where({ id }).del();
};

export {
  getBidsForAuction,
  getBidById,
  addBid,
  deleteBidById,
  getBidsByUser,
  getAllBids,
};
