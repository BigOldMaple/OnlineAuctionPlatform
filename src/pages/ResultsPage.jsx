/**
 * ResultsPage Component
 * 
 * A dynamic search results and category browsing page with animated item display.
 * 
 * Features:
 * - Search results display
 * - Category filtering
 * - Animated item grid
 * - Empty state handling
 * - Loading and error states
 * - Responsive grid layout
 * - Dark/light mode support
 * 
 * Dependencies:
 * - Framer Motion: Animations
 * - AuctionCard: Individual item display
 * - API Integration: Auction data fetching
 * - React Router: Navigation and query parameters
 * 
 * Data Flow:
 * 1. Extracts search/category parameters from URL
 * 2. Fetches auction items
 * 3. Filters based on search/category
 * 4. Animates results into view
 */

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Search, 
  Package, 
  Loader2,
  AlertCircle,
  LayoutGrid
} from "lucide-react";
import { fetchAuctions } from "../services/api";
import AuctionCard from "../components/AuctionCard";

// Animation configurations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05 // Stagger children animations
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 500
    }
  }
};

function ResultsPage() {
  // Hooks for routing and navigation
  const location = useLocation();
  const navigate = useNavigate();

  // Local state management
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";
  const category = queryParams.get("category") || "";

  // Fetch and filter results
  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      setError(null);
      try {
        // Fetch all auction items
        const items = await fetchAuctions();

        // Filter based on search query or category
        const filteredItems = items.filter((item) => {
          if (searchQuery) {
            return item.title.toLowerCase().includes(searchQuery.toLowerCase());
          }
          if (category) {
            return item.category.toLowerCase() === category.toLowerCase();
          }
          return true;
        });

        setResults(filteredItems);
      } catch (error) {
        setError("Failed to load items. Please try again.");
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [searchQuery, category]);

  // Loading state UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
            Loading items...
          </p>
        </div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Error Loading Items
          </h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main UI render
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          {/* Back Navigation */}
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost gap-2 text-gray-600 dark:text-gray-300 hover:text-primary mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>

          {/* Title Section */}
          <div className="flex items-center gap-3 mb-6">
            {searchQuery ? (
              <Search className="h-6 w-6 text-primary" />
            ) : (
              <LayoutGrid className="h-6 w-6 text-primary" />
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {searchQuery 
                ? `Results for "${searchQuery}"`
                : `Browsing ${category} category`
              }
            </h1>
          </div>

          {/* Results Count */}
          <p className="text-gray-600 dark:text-gray-300">
            Found {results.length} item{results.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Results Display */}
        {results.length > 0 ? (
          // Animated grid of results
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {results.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
              >
                <AuctionCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Empty state
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No items found
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {searchQuery 
                ? "Try adjusting your search terms"
                : "No items available in this category yet"
              }
            </p>
            <button
              onClick={() => navigate('/auctions')}
              className="btn btn-primary"
            >
              Browse All Items
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultsPage;