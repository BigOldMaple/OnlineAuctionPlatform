// db/utils/createAuctionForItem.js
import db from "../db/db.js";

export const createAuctionForItem = async (itemData) => {
  const trx = await db.transaction();
  
  try {
    // First, check if item exists
    const existingItem = await trx('items')
      .where({ id: itemData.id })
      .first();
    
    // If item doesn't exist, create it
    if (!existingItem) {
      await trx('items').insert({
        id: itemData.id,
        name: itemData.title,
        description: itemData.description,
        starting_price: itemData.price,
        image_url: itemData.image
      });
    }

    // Create the auction
    const [auction] = await trx('auctions').insert({
      item_id: itemData.id,
      start_time: new Date(),
      end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      current_bid: itemData.price, // Use price as starting bid
      created_at: new Date(),
      updated_at: new Date()
    }).returning('*');

    await trx.commit();
    return auction;
  } catch (error) {
    await trx.rollback();
    console.error('Error creating auction:', error);
    throw error;
  }
};