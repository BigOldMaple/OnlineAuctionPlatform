
/**
 * fetchAuctions
 *
 * Fetches a list of auction items from a fake store API. 
 * Returns an array of auction items or an empty array if the request fails.
 *
 * Uses:
 * - `axios` for making the GET request.
 * - Logs any errors encountered during the request.
 *
 * @returns {Array} Array of auction items from the API or an empty array if an error occurs.
 */
import axios from "axios";

export async function fetchAuctions() {
  try {
    const response = await axios.get("https://fakestoreapi.com/products");
    return response.data;
  } catch (error) {
    console.error("Error fetching auctions:", error);
    return [];
  }
}
