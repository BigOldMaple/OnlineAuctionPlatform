// db/controllers/userController.js

const validateAuth0UserData = (userData) => {
  const errors = [];
  
  if (!userData.auth0_id) {
    errors.push('Auth0 ID is required');
  }
  
  if (!userData.email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.push('Invalid email format');
  }
  
  // Firstname and lastname are optional but should be sanitized if present
  userData.firstname = userData.firstname?.trim() || 'Anonymous';
  userData.lastname = userData.lastname?.trim() || 'User';
  
  return errors;
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

    // Validate user data
    const validationErrors = validateAuth0UserData(userData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation Error',
        messages: validationErrors
      });
    }

    // Check for existing user first
    const existingUser = await getUserByAuth0Id(userData.auth0_id);
    
    let user;
    if (existingUser) {
      // Update existing user
      user = await createOrUpdateUser({
        ...existingUser,
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
      message: existingUser ? 'User updated successfully' : 'User created successfully'
    });
  } catch (error) {
    console.error('Error in handleAuth0User:', error);
    return res.status(500).json({
      error: 'Server Error',
      message: 'Failed to process user data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};