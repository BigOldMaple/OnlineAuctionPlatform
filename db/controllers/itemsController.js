// db/controllers/itemsController.js
import {
  getAllItems,
  getItemById,
  addItem,
  updateItem as updateItemModel,
  deleteItem as deleteItemModel,
  syncItem as syncItemModel
} from "../models/itemsModel.js";

export const getItems = async (req, res) => {
  try {
    const items = await getAllItems();
    return res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error("Error in getItems:", error);
    return res.status(500).json({
      error: 'Failed to retrieve items',
      message: error.message
    });
  }
};

export const getItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await getItemById(id);
    
    if (!item) {
      return res.status(404).json({
        error: 'Item not found',
        message: `No item found with ID ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error("Error in getItem:", error);
    return res.status(500).json({
      error: 'Failed to retrieve item',
      message: error.message
    });
  }
};

export const createItem = async (req, res) => {
  try {
    const itemData = req.body;

    if (!itemData.name || !itemData.starting_price) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'starting_price'],
        received: Object.keys(itemData)
      });
    }

    const newItem = await addItem(itemData);
    return res.status(201).json({
      success: true,
      data: newItem,
      message: 'Item created successfully'
    });
  } catch (error) {
    console.error("Error in createItem:", error);
    return res.status(500).json({
      error: 'Failed to create item',
      message: error.message
    });
  }
};

export const updateItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const itemData = req.body;

    const updatedItem = await updateItemModel(id, itemData);
    
    if (!updatedItem) {
      return res.status(404).json({
        error: 'Item not found',
        message: `No item found with ID ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedItem,
      message: 'Item updated successfully'
    });
  } catch (error) {
    console.error("Error in updateItemById:", error);
    return res.status(500).json({
      error: 'Failed to update item',
      message: error.message
    });
  }
};

export const deleteItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteItemModel(id);
    
    if (!deleted) {
      return res.status(404).json({
        error: 'Item not found',
        message: `No item found with ID ${id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error("Error in deleteItemById:", error);
    return res.status(500).json({
      error: 'Failed to delete item',
      message: error.message
    });
  }
};

export const syncItem = async (req, res) => {
  try {
    const itemData = req.body;
    
    if (!itemData.id || !itemData.title || !itemData.price) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['id', 'title', 'price'],
        received: Object.keys(itemData)
      });
    }

    const transformedData = {
      id: itemData.id,
      name: itemData.title,
      description: itemData.description,
      starting_price: itemData.price,
      image_url: itemData.image
    };

    await syncItemModel(transformedData);

    return res.status(200).json({
      success: true,
      message: 'Item synced successfully'
    });
  } catch (error) {
    console.error("Error in syncItem:", error);
    return res.status(500).json({
      error: 'Failed to sync item',
      message: error.message
    });
  }
};