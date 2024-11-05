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
import React from "react";

function HeroSection() {
  return (
    <section className="bg-blue-800 text-white py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to AuctionSite</h1>
      <p className="text-lg mb-6">
        Discover unique items and collectibles from around the world. Bid, win, and make great finds!
      </p>
    </section>
  );
}

export default HeroSection;
