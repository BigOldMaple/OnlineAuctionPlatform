// db/models/userModel.js
import db from "../db/db.js";

/**
 * Get all users from the database
 * @returns {Promise<Array>} Array of user objects
 */
export const getAllUsers = async () => {
  try {
    const users = await db("users")
      .select(
        "id",
        "firstname",
        "lastname",
        "email",
        "auth0_id",
        "created_at",
        "updated_at"
      )
      .orderBy([
        { column: "firstname", order: "asc" },
        { column: "lastname", order: "asc" }
      ]);
    
    return users;
  } catch (error) {
    console.error("Database error in getAllUsers:", error);
    throw new Error(`Failed to retrieve users: ${error.message}`);
  }
};

/**
 * Get a user by their database ID
 * @param {number} id - The user's database ID
 * @returns {Promise<Object|null>} User object or null if not found
 */
export const getUserById = async (id) => {
  try {
    const user = await db("users")
      .select(
        "id",
        "firstname",
        "lastname",
        "email",
        "auth0_id",
        "created_at",
        "updated_at"
      )
      .where({ id })
      .first();
    
    return user || null;
  } catch (error) {
    console.error("Database error in getUserById:", error);
    throw new Error(`Failed to retrieve user: ${error.message}`);
  }
};

/**
 * Get a user by their Auth0 ID
 * @param {string} auth0Id - The user's Auth0 ID
 * @returns {Promise<Object|null>} User object or null if not found
 */
export const getUserByAuth0Id = async (auth0Id) => {
  try {
    const user = await db("users")
      .select(
        "id",
        "firstname",
        "lastname",
        "email",
        "auth0_id",
        "created_at",
        "updated_at"
      )
      .where({ auth0_id: auth0Id })
      .first();
    
    return user || null;
  } catch (error) {
    console.error("Database error in getUserByAuth0Id:", error);
    throw new Error(`Failed to retrieve user by Auth0 ID: ${error.message}`);
  }
};

/**
 * Get a user by their email address
 * @param {string} email - The user's email address
 * @returns {Promise<Object|null>} User object or null if not found
 */
export const getUserByEmail = async (email) => {
  try {
    const user = await db("users")
      .select(
        "id",
        "firstname",
        "lastname",
        "email",
        "auth0_id",
        "created_at",
        "updated_at"
      )
      .where({ email: email.toLowerCase() })
      .first();
    
    return user || null;
  } catch (error) {
    console.error("Database error in getUserByEmail:", error);
    throw new Error(`Failed to retrieve user by email: ${error.message}`);
  }
};

/**
 * Create a new user
 * @param {Object} userData - User data object
 * @returns {Promise<Object>} Created user object
 */
export const createUser = async (userData) => {
  const trx = await db.transaction();
  
  try {
    // Check if user already exists with the same email or auth0_id
    const existingUser = await trx("users")
      .where("email", userData.email.toLowerCase())
      .orWhere("auth0_id", userData.auth0_id)
      .first();

    if (existingUser) {
      await trx.rollback();
      throw new Error("User already exists with this email or Auth0 ID");
    }

    const [newUser] = await trx("users")
      .insert({
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email.toLowerCase(),
        auth0_id: userData.auth0_id,
        created_at: trx.fn.now(),
        updated_at: trx.fn.now()
      })
      .returning("*");

    await trx.commit();
    return newUser;
  } catch (error) {
    await trx.rollback();
    console.error("Database error in createUser:", error);
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

/**
 * Update an existing user
 * @param {number} id - The user's database ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user object
 */
export const updateUser = async (id, userData) => {
  const trx = await db.transaction();
  
  try {
    // Check if user exists
    const existingUser = await trx("users").where({ id }).first();
    if (!existingUser) {
      await trx.rollback();
      throw new Error("User not found");
    }

    // If email is being updated, check for duplicates
    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await trx("users")
        .where("email", userData.email.toLowerCase())
        .whereNot("id", id)
        .first();

      if (emailExists) {
        await trx.rollback();
        throw new Error("Email already in use");
      }
    }

    const [updatedUser] = await trx("users")
      .where({ id })
      .update({
        ...userData,
        email: userData.email?.toLowerCase(),
        updated_at: trx.fn.now()
      })
      .returning("*");

    await trx.commit();
    return updatedUser;
  } catch (error) {
    await trx.rollback();
    console.error("Database error in updateUser:", error);
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

/**
 * Create or update a user based on Auth0 ID
 * @param {Object} userData - User data including Auth0 ID
 * @returns {Promise<Object>} Created or updated user object
 */
export const createOrUpdateUser = async (userData) => {
  const trx = await db.transaction();
  
  try {
    console.log('Creating/Updating user with data:', {
      ...userData,
      auth0_id: '[REDACTED]'
    });

    const existingUser = await trx("users")
      .where({ auth0_id: userData.auth0_id })
      .first();

    let result;
    
    if (existingUser) {
      // Update existing user
      [result] = await trx("users")
        .where({ id: existingUser.id })
        .update({
          firstname: userData.firstname || existingUser.firstname,
          lastname: userData.lastname || existingUser.lastname,
          email: userData.email || existingUser.email,
          updated_at: trx.fn.now()
        })
        .returning("*");
    } else {
      // Create new user
      [result] = await trx("users")
        .insert({
          firstname: userData.firstname,
          lastname: userData.lastname,
          email: userData.email,
          auth0_id: userData.auth0_id,
          created_at: trx.fn.now(),
          updated_at: trx.fn.now()
        })
        .returning("*");
    }

    await trx.commit();
    return result;
  } catch (error) {
    await trx.rollback();
    console.error("Database error in createOrUpdateUser:", error);
    throw new Error(`Failed to create or update user: ${error.message}`);
  }
};

/**
 * Delete a user by their database ID
 * @param {number} id - The user's database ID
 * @returns {Promise<boolean>} True if user was deleted, false if user was not found
 */
export const deleteUserById = async (id) => {
  const trx = await db.transaction();
  
  try {
    const deleted = await trx("users").where({ id }).del();
    await trx.commit();
    return deleted > 0;
  } catch (error) {
    await trx.rollback();
    console.error("Database error in deleteUserById:", error);
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};

/**
 * Delete a user by their Auth0 ID
 * @param {string} auth0Id - The user's Auth0 ID
 * @returns {Promise<boolean>} True if user was deleted, false if user was not found
 */
export const deleteUserByAuth0Id = async (auth0Id) => {
  const trx = await db.transaction();
  
  try {
    const deleted = await trx("users").where({ auth0_id: auth0Id }).del();
    await trx.commit();
    return deleted > 0;
  } catch (error) {
    await trx.rollback();
    console.error("Database error in deleteUserByAuth0Id:", error);
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};