/**
 * AuctionCard Component
 *
 * The `AuctionCard` component is a presentational component that displays a single auction item's
 * details in a styled card format. It receives `item` as a prop, which contains all necessary data 
 * about the auction item (title, description, price, category, image, and rating).
 *
 * Key Elements:
 * - **Image**: Displays the item's image, centered and cropped within the designated space.
 * - **Title**: Shows the title of the auction item, truncated if it’s too long.
 * - **Description**: Brief description of the item, limited to three lines for consistent card height.
 * - **Price**: Displays the current price or starting bid of the item.
 * - **Category**: The category of the item (electronics, jewelry).
 * - **Rating**: Displays the item’s rating and the number of reviews.
 *
 * Styling:
 * - The card is designed with a fixed width and height for uniformity in a grid layout.
 * - Includes background, border, and text styling for a dark theme, with colors indicating
 *   different text elements (green for price, blue for category, yellow for rating).
 */
import React from "react";

function AuctionCard({ item }) {
  return (
    <div className="w-72 h-96 p-4 border border-gray-700 rounded-lg shadow-md bg-gray-900 flex flex-col">
      <div className="h-48 flex justify-center items-center mb-4 overflow-hidden">
        <img src={item.image} alt={item.title} className="object-cover h-full" />
      </div>
      <h3 className="text-xl font-semibold text-white truncate">{item.title}</h3>
      <p className="text-gray-400 mt-2 overflow-hidden" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
        {item.description}
      </p>
      <div className="mt-auto">
        <p className="text-green-400 mt-2">Price: ${item.price}</p>
        <p className="text-blue-300">Category: {item.category}</p>
        <p className="text-yellow-400">Rating: {item.rating.rate} ({item.rating.count} reviews)</p>
      </div>
    </div>
  );
}

export default AuctionCard;
