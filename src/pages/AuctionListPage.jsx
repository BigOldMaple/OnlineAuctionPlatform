/**
 * AuctionListPage Component
 *
 * This component displays various auction sections, including Featured Auctions,
 * Recently Listed Items, and Ending Soon items. It fetches auction data from an
 * API and organizes the data into these sections using horizontal scrollable
 * sections.
 *
 * State:
 * - `featuredAuctions`: Array of auctions displayed in the "Featured Auctions" section.
 * - `recentAuctions`: Array of auctions for "Recently Listed Items."
 * - `endingSoonAuctions`: Array of auctions for "Ending Soon" items.
 * - `loading`: Boolean indicating whether the auction data is still loading.
 *
 * API:
 * - Uses `fetchAuctions` from the API service to retrieve auction data.
 */

import React, { useState, useEffect } from "react";
import { fetchAuctions } from "../services/api";
import HeroSection from "../components/HeroSection";
import CategoryLinks from "../components/CategoryLinks";
import HorizontalScrollSection from "../components/HorizontalScrollSection";
import AuctionCard from "../components/AuctionCard";

function AuctionListPage() {
  const [featuredAuctions, setFeaturedAuctions] = useState([]);
  const [recentAuctions, setRecentAuctions] = useState([]);
  const [endingSoonAuctions, setEndingSoonAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAuctions() {
      setLoading(true);
      const products = await fetchAuctions();
      setFeaturedAuctions(products.slice(0, 5));
      setRecentAuctions(products.slice(5, 10));
      setEndingSoonAuctions(products.slice(10, 15));
      setLoading(false);
    }

    loadAuctions();
  }, []);

  if (loading) {
    return <div className="text-center text-white py-20">Loading...</div>;
  }

  return (
    <div className="space-y-12 text-gray-300">
      <HeroSection />
      
      {/* Featured Auctions */}
      <HorizontalScrollSection
        title="Featured Auctions"
        items={featuredAuctions}
        renderCard={(item) => <AuctionCard item={item} />}
      />

      <CategoryLinks />

      {/* Recently Listed Items */}
      <HorizontalScrollSection
        title="Recently Listed Items"
        items={recentAuctions}
        renderCard={(item) => <AuctionCard item={item} />}
      />

      {/* Ending Soon */}
      <HorizontalScrollSection
        title="Ending Soon"
        items={endingSoonAuctions}
        renderCard={(item) => <AuctionCard item={item} />}
      />
    </div>
  );
}

export default AuctionListPage;
