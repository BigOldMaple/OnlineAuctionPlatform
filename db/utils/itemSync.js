// itemSync.js
// Utility function for syncing item data to the database. This function checks if an item with a
// specific ID exists in the database. If it does, the function updates the existing item with the
// latest data (e.g., name, description, price, image URL). If the item does not exist, it inserts
// a new record into the items table. The function uses a transaction to ensure data integrity and
// rolls back any changes if an error occurs during the operation.

import db from "../db/db.js";

export const syncItem = async (itemData) => {
  const trx = await db.transaction();
  
  try {
    // Check if the item already exists in the database by its ID
    const existingItem = await trx('items')
      .where({ id: itemData.id })
      .first(); // Retrieve the first matching record

    if (existingItem) {
      // If the item exists, update its details with the new data
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
      // If the item doesn't exist, insert it as a new record
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