/**
 * AuctionListPage Component
 * 
 * This component serves as the main auction browsing page, displaying auctions in horizontal scrollable sections.
 * 
 * Features:
 * - Displays auctions in three categories: Featured, Recent, and Ending Soon
 * - Responsive design with dark/light mode support
 * - Lazy loading of auction data
 * - Error handling with retry functionality
 * 
 * Dependencies:
 * - HeroSection: Displays welcome message and category links
 * - HorizontalScrollSection: Handles scrollable auction displays
 * - AuctionCard: Individual auction item display
 * - fetchAuctions: API service for auction data
 * 
 * State Management:
 * - Uses React.memo for performance optimization
 * - Manages loading and error states
 * - Caches auction data in sections
 */

import React, { useState, useEffect, useCallback, memo } from "react";
import { fetchAuctions } from "../services/api";
import HeroSection from "../components/HeroSection";
import HorizontalScrollSection from "../components/HorizontalScrollSection";
import AuctionCard from "../components/AuctionCard";
import { Loader2, AlertCircle } from "lucide-react";

// Configuration for auction sections
const AUCTIONS_PER_SECTION = 5;
const SECTION_CONFIGS = [
  { title: "Featured Auctions", startIndex: 0 },
  { title: "Recently Listed Items", startIndex: 5 },
  { title: "Ending Soon", startIndex: 10 }
];

// Memoized wrapper for AuctionCard to prevent unnecessary re-renders
const AuctionCardWrapper = memo(({ item }) => (
  <div className="snap-start w-[280px] md:w-[320px] flex-shrink-0 px-2">
    <AuctionCard item={item} />
  </div>
));

AuctionCardWrapper.displayName = "AuctionCardWrapper";

function AuctionListPage() {
  // State management for auctions, loading, and error handling
  const [auctionSections, setAuctionSections] = useState({
    featured: [],
    recent: [],
    endingSoon: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized function to load auctions from API
  const loadAuctions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch auctions and split into sections
      const products = await fetchAuctions();
      setAuctionSections({
        featured: products.slice(0, AUCTIONS_PER_SECTION),
        recent: products.slice(AUCTIONS_PER_SECTION, AUCTIONS_PER_SECTION * 2),
        endingSoon: products.slice(AUCTIONS_PER_SECTION * 2, AUCTIONS_PER_SECTION * 3)
      });
    } catch (error) {
      console.error('Failed to load auctions:', error);
      setError('Failed to load auctions. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load auctions on component mount
  useEffect(() => {
    loadAuctions();
  }, [loadAuctions]);

  // Loading state UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="text-center">
          <Loader2
            className="h-12 w-12 animate-spin mx-auto mb-4 text-primary"
            aria-hidden="true"
          />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-200 transition-colors"
             role="status"
          >
            Loading auctions...
          </p>
        </div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all max-w-md mx-4">
          <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 transition-colors">
            {error}
          </p>
          <button
            onClick={loadAuctions}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Prepare data for rendering
  const sectionData = {
    featured: auctionSections.featured,
    recent: auctionSections.recent,
    endingSoon: auctionSections.endingSoon
  };

  // Main UI
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8 max-w-7xl mx-auto">
        {/* Hero section with category navigation */}
        <div className="mb-8 md:mb-12">
          <HeroSection />
        </div>

        {/* Auction sections */}
        <div className="space-y-8 md:space-y-12">
          {Object.entries(sectionData).map(([key, items], index) => (
            <section key={key} className="relative">
              <HorizontalScrollSection
                title={SECTION_CONFIGS[index].title}
                items={items}
                renderCard={(item) => (
                  <AuctionCardWrapper key={item.id} item={item} />
                )}
              />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(AuctionListPage);