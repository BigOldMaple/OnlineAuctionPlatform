/**
 * HeroSection Component
 *
 * A welcoming banner for the homepage, featuring:
 * - **Title**: Introduces the auction site.
 * - **Description**: Briefly invites users to explore unique items.
 *
 * Styling:
 * - Centered with a bold title, short description, and an attention-grabbing button.
 */
// src/components/HeroSection.jsx

import React from "react";
import CategoryLinks from "./CategoryLinks";

function HeroSection() {
  return (
    <section className="bg-gray-800 text-gray-100 py-8 sm:py-12 md:py-16 text-center shadow-lg rounded-lg mx-2 sm:mx-4 md:mx-auto max-w-4xl">
      <div className="px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
          Welcome to AuctionSite
        </h1>
        <p className="text-base sm:text-lg mb-6 sm:mb-8 max-w-xl mx-auto">
          Discover unique items and collectibles from around the world. Bid, win, and make great finds!
        </p>
        {/* New Heading and Category Links */}
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
          Search Popular Categories
        </h2>
        <div className="flex justify-center overflow-x-auto px-2">
          <CategoryLinks />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
