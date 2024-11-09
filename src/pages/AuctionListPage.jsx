import React, { useState, useEffect, useCallback, memo } from "react";
import { fetchAuctions } from "../services/api";
import HeroSection from "../components/HeroSection";
import CategoryLinks from "../components/CategoryLinks";
import HorizontalScrollSection from "../components/HorizontalScrollSection";
import AuctionCard from "../components/AuctionCard";
import { Loader2 } from "lucide-react";

const AUCTIONS_PER_SECTION = 5;
const SECTION_CONFIGS = [
  { title: "Featured Auctions", startIndex: 0 },
  { title: "Recently Listed Items", startIndex: 5 },
  { title: "Ending Soon", startIndex: 10 }
];

const AuctionCardWrapper = memo(({ item }) => (
  <div className="snap-start w-[280px] md:w-[320px] flex-shrink-0 px-2">
    <AuctionCard item={item} />
  </div>
));

AuctionCardWrapper.displayName = "AuctionCardWrapper";

function AuctionListPage() {
  const [auctionSections, setAuctionSections] = useState({
    featured: [],
    recent: [],
    endingSoon: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAuctions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
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

  useEffect(() => {
    loadAuctions();
  }, [loadAuctions]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 
            className="h-12 w-12 animate-spin mx-auto mb-4 text-gray-600 dark:text-gray-300" 
            aria-hidden="true" 
          />
          <p className="text-lg font-medium text-gray-700 dark:text-gray-200" role="status">
            Loading auctions...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-4">
          <p className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">{error}</p>
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

  const sectionData = {
    featured: auctionSections.featured,
    recent: auctionSections.recent,
    endingSoon: auctionSections.endingSoon
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8 max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12">
          <HeroSection />
        </div>

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

export default memo(AuctionListPage);