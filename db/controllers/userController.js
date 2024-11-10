// db/controllers/userController.js
import {
  getAllUsers,
  getUserById,
  createUser,
  deleteUserById,
  createOrUpdateUser,
  getUserByAuth0Id
} from "../models/userModel.js";

// Helper functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateUserData = (userData, requiredFields = ['firstname', 'lastname', 'email']) => {
  const errors = [];
  
  requiredFields.forEach(field => {
    if (!userData[field]) {
      errors.push(`Missing ${field}`);
    }
  });
  
  if (userData.email && !validateEmail(userData.email)) {
    errors.push('Invalid email format');
  }
  
  return errors;
};

const handleError = (error, res, customMessage) => {
  console.error(`Error in ${customMessage}:`, error);
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  
  return res.status(statusCode).json({
    error: customMessage,
    message: process.env.NODE_ENV === 'development' ? message : 'An error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

// Controller functions
export const getUsers = async (req, res) => {
  try {
    const results = await getAllUsers();
    return res.status(200).json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    return handleError(error, res, 'Failed to retrieve users');
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
    return handleError(error, res, 'Failed to retrieve user');
  }
};

export const addNewUser = async (req, res) => {
  try {
    const userData = {
      firstname: req.body.firstname?.trim(),
      lastname: req.body.lastname?.trim(),
      email: req.body.email?.trim().toLowerCase(),
    };

    const validationErrors = validateUserData(userData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation Error',
        messages: validationErrors
      });
    }

    const result = await createUser(userData);
    return res.status(201).json({
      success: true,
      data: result,
      message: 'User created successfully'
    });
  } catch (error) {
    return handleError(error, res, 'Failed to create user');
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
    return handleError(error, res, 'Failed to delete user');
  }
};

export const handleAuth0User = async (req, res) => {
  try {
    console.log('Received Auth0 user data:', {
      ...req.body,
      auth0_id: req.body.auth0_id ? '[REDACTED]' : undefined
    });

    const userData = {
      firstname: req.body.firstname?.trim() || 'Anonymous',
      lastname: req.body.lastname?.trim() || 'User',
      email: req.body.email?.trim().toLowerCase(),
      auth0_id: req.body.auth0_id
    };

    if (!userData.auth0_id || !userData.email) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Missing required fields',
        required: ['auth0_id', 'email'],
        received: Object.keys(userData)
      });
    }

    const validationErrors = validateUserData(userData, ['email']);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation Error',
        messages: validationErrors
      });
    }

    const user = await createOrUpdateUser(userData);
    console.log('User processed successfully:', {
      ...user,
      auth0_id: '[REDACTED]'
    });

    return res.status(200).json({
      success: true,
      data: user,
      message: 'User synchronized successfully'
    });
  } catch (error) {
    return handleError(error, res, 'Failed to process Auth0 user');
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
    return handleError(error, res, 'Failed to fetch Auth0 user');
  }
};