import axios from "axios";

class UserService {
  constructor() {
    this.baseURL = "http://localhost:5005/api/users"; // Update with your backend URL
  }

  async createOrUpdateUser(auth0User) {
    if (!auth0User) return null;

    try {
      // Format user data to match database schema
      const userData = {
        firstname:
          auth0User.given_name ||
          auth0User.nickname ||
          auth0User.name?.split(" ")[0] ||
          "Anonymous",
        lastname:
          auth0User.family_name ||
          auth0User.name?.split(" ").slice(1).join(" ") ||
          "User",
        email: auth0User.email,
        auth0_id: auth0User.sub, // Store Auth0 ID for reference
      };

      // Check if user exists
      const response = await axios.post(`${this.baseURL}/auth0`, userData);
      return response.data;
    } catch (error) {
      console.error("Error syncing user with database:", error);
      throw error;
    }
  }

  async getUserByAuth0Id(auth0Id) {
    try {
      const response = await axios.get(`${this.baseURL}/auth0/${auth0Id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }
}

export default new UserService();
