// db/models/userModel.js
import db from "../db/db.js";

export const getAllUsers = async () => {
  const results = await db
    .select("*")
    .from("users")
    .orderBy([{ column: "firstname", order: "asc" }]);
  return results;
};

export const getUserById = async (id) => {
  return await db("users").where({ id }).first();
};

export const createUser = async (userData) => {
  const [id] = await db("users").insert(userData).returning("id");
  return { id };
};

export const deleteUserById = async (id) => {
  return await db("users").where({ id }).del();
};

export const getUserByAuth0Id = async (auth0Id) => {
  return await db("users").where({ auth0_id: auth0Id }).first();
};

export const createOrUpdateUser = async (userData) => {
  try {
    console.log('Creating/Updating user with data:', userData);
    
    const existingUser = await db("users")
      .where({ auth0_id: userData.auth0_id })
      .first();
    
    if (existingUser) {
      console.log('Updating existing user:', existingUser.id);
      
      await db("users")
        .where({ id: existingUser.id })
        .update({
          firstname: userData.firstname,
          lastname: userData.lastname,
          email: userData.email,
          updated_at: db.fn.now()
        });
      
      return { 
        ...existingUser, 
        ...userData, 
        updated_at: new Date() 
      };
    } else {
      console.log('Creating new user');
      
      const [newUser] = await db("users")
        .insert({
          firstname: userData.firstname,
          lastname: userData.lastname,
          email: userData.email,
          auth0_id: userData.auth0_id,
          created_at: db.fn.now(),
          updated_at: db.fn.now()
        })
        .returning('*');
      
      console.log('New user created:', newUser);
      return newUser;
    }
  } catch (error) {
    console.error('Error in createOrUpdateUser:', error);
    throw new Error(`Database error: ${error.message}`);
  }
};