// db/controllers/userController.js
import {
  getAllUsers,
  getUserById,
  createOrUpdateUser,
  deleteUserById,
  getUserByAuth0Id
} from "../models/userModel.js";

export const getUsers = async (req, res) => {
  try {
    const results = await getAllUsers();
    return res.status(200).json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error("Error in getUsers:", error);
    return res.status(500).json({
      error: 'Failed to retrieve users',
      message: error.message
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid user ID',
        message: 'User ID must be a valid number'
      });
    }

    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Error in getUser:", error);
    return res.status(500).json({
      error: 'Failed to retrieve user',
      message: error.message
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const userData = {
      firstname: req.body.firstname?.trim(),
      lastname: req.body.lastname?.trim(),
      email: req.body.email?.trim().toLowerCase(),
    };

    if (!userData.firstname || !userData.lastname || !userData.email) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['firstname', 'lastname', 'email'],
        received: Object.keys(userData)
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    const newUser = await createOrUpdateUser(userData);
    return res.status(201).json({
      success: true,
      data: newUser,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error("Error in createUser:", error);
    return res.status(500).json({
      error: 'Failed to create user',
      message: error.message
    });
  }
};

export const removeUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid user ID',
        message: 'User ID must be a valid number'
      });
    }

    const deleted = await deleteUserById(id);
    if (!deleted) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error("Error in removeUser:", error);
    return res.status(500).json({
      error: 'Failed to delete user',
      message: error.message
    });
  }
};

export const handleAuth0User = async (req, res) => {
  try {
    console.log('Received Auth0 user data:', {
      ...req.body,
      auth0_id: req.body.auth0_id ? '[REDACTED]' : undefined
    });

    // Extract and validate required fields
    const { auth0_id, email, firstname, lastname } = req.body;

    // Validate auth0_id
    if (!auth0_id) {
      return res.status(400).json({
        error: 'Missing auth0_id',
        message: 'Auth0 ID is required'
      });
    }

    // Validate email with fallback
    const userEmail = email || `${auth0_id}@temp.user`;
    
    // Prepare user data with defaults
    const userData = {
      auth0_id,
      email: userEmail.toLowerCase(),
      firstname: firstname?.trim() || 'Anonymous',
      lastname: lastname?.trim() || 'User'
    };

    console.log('Processing user data:', {
      ...userData,
      auth0_id: '[REDACTED]'
    });

    // Check for existing user
    let user = await getUserByAuth0Id(auth0_id);
    
    if (user) {
      // Update existing user
      user = await createOrUpdateUser({
        ...user,
        ...userData
      });
      console.log('Updated existing user:', {
        ...user,
        auth0_id: '[REDACTED]'
      });
    } else {
      // Create new user
      user = await createOrUpdateUser(userData);
      console.log('Created new user:', {
        ...user,
        auth0_id: '[REDACTED]'
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
      message: 'User synchronized successfully'
    });
  } catch (error) {
    console.error('Error in handleAuth0User:', error);
    return res.status(500).json({
      error: 'Server Error',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getAuth0User = async (req, res) => {
  try {
    const { auth0Id } = req.params;
    
    if (!auth0Id) {
      return res.status(400).json({
        error: 'Invalid Request',
        message: 'Auth0 ID is required'
      });
    }

    const user = await getUserByAuth0Id(auth0Id);
    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error in getAuth0User:', error);
    return res.status(500).json({
      error: 'Failed to fetch Auth0 user',
      message: error.message
    });
  }
};