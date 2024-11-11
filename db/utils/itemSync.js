// db/utils/itemSync.js
import db from "../db/db.js";

export const syncItem = async (itemData) => {
  const trx = await db.transaction();
  
  try {
    // Check if item exists
    const existingItem = await trx('items')
      .where({ id: itemData.id })
      .first();

    if (existingItem) {
      // Update existing item
      await trx('items')
        .where({ id: itemData.id })
        .update({
          name: itemData.title,
          description: itemData.description,
          starting_price: itemData.price,
          image_url: itemData.image,
          updated_at: trx.fn.now()
        });
    } else {
      // Create new item
      await trx('items')
        .insert({
          id: itemData.id,
          name: itemData.title,
          description: itemData.description,
          starting_price: itemData.price,
          image_url: itemData.image,
          created_at: trx.fn.now(),
          updated_at: trx.fn.now()
        });
    }

    await trx.commit();
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};