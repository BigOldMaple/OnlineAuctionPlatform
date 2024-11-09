/**
 * HomePage Component
 *
 * This component serves as the main landing page for the auction site. It provides:
 * - A welcome message and introductory buttons to access the Auction List or start bidding.
 * - A detailed guide on using the website, including steps on how to browse items, view details,
 *   place bids, and create an account.
 * - Helpful tips to improve the user experience, like setting maximum bids and tracking auctions.
 *
 * Links:
 * - "Auction List" and "Start Bidding" buttons navigate to the AuctionListPage.
 * - Links are styled for easy navigation, with the guide section designed to be visually distinct.
 */
import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to the Auction Site</h1>
      <p className="text-lg mb-8">Find the best items to bid on and start bidding today!</p>

      <div className="space-x-4 mb-8">
        <Link to="/auctions">
          <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
            Start Bidding
          </button>
        </Link>
      </div>

      {/* User Guide Section */}
      <section className="text-left bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">How to Use Our Auction Site</h2>
        
        <p className="mb-4">
          Our auction site offers an easy and enjoyable way to bid on your favorite items.
          Follow the steps below to get started:
        </p>

        <ol className="list-decimal list-inside mb-4 space-y-2">
          <li>
            <strong>Browse Auctions:</strong> Visit the <Link to="/auctions" className="text-blue-400 hover:underline">Auction List</Link> page to view all available items. Each item card displays essential information, like the title, description, and current bid.
          </li>
          <li>
            <strong>View Item Details:</strong> Click on an item to see more details, including the full description, category, and rating. From here, you can decide if you want to place a bid.
          </li>
          <li>
            <strong>Place a Bid:</strong> To participate in an auction, enter your bid amount and confirm.
          </li>
          <li>
            <strong>Create an Account:</strong> Log in or sign up to track your bidding history and receive updates on your items.
          </li>
        </ol>

        <h3 className="text-xl font-semibold mt-6">Helpful Tips</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>Set a maximum bid amount to avoid overbidding.</li>
          <li>Monitor the countdown timer on each auction to know when bidding ends.</li>
          <li>Check your account for updates on your bid status.</li>
        </ul>
      </section>
    </div>
  );
}

export default HomePage;
