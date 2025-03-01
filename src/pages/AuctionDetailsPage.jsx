/**
 * AuctionDetailsPage Component
 * 
 * This component displays detailed information about a specific auction item and handles bidding and watchlist functionality.
 * 
 * Features:
 * - Displays comprehensive auction item details
 * - Handles bidding through modal interface
 * - Manages watchlist functionality (add/remove items)
 * - Real-time price updates
 * - Dark/light mode support
 * 
 * Dependencies:
 * - BidModal: Handles bidding interface
 * - Auth0: User authentication
 * - ThemeContext: Dark/light mode management
 * - API Integrations: Items, auctions, and watchlist endpoints
 * 
 * Data Flow:
 * 1. Fetches item details from external API
 * 2. Syncs item to local database
 * 3. Creates or retrieves auction details
 * 4. Manages watchlist status
 * 5. Handles bid placements
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAuctions } from "../services/api";
import BidModal from "../components/BidModal";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth0 } from "@auth0/auth0-react";
import { 
  ArrowLeft, 
  Star, 
  Heart,
  Clock, 
  Loader2,
  StopCircle
} from "lucide-react";
import { toast } from "react-toastify";

function AuctionDetailsPage() {
  // Route and navigation hooks
  const { id } = useParams();
  const navigate = useNavigate();

  // State management
  const [item, setItem] = useState(null);
  const [auction, setAuction] = useState(null);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isWatched, setIsWatched] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  // Context hooks
  const { isDarkMode } = useTheme();
  const { user, isAuthenticated } = useAuth0();

  // Watchlist status check function
  const checkWatchlistStatus = async (userId, itemId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/watchlist/${userId}/${itemId}/check`
      );
      if (response.ok) {
        const data = await response.json();
        setIsWatched(data.isWatched);
      }
    } catch (error) {
      console.error('Error checking watchlist status:', error);
    }
  };

  // End auction handler
  const handleEndAuction = async () => {
    if (!auction) return;

    try {
      // Show loading toast
      const loadingToast = toast.loading('Ending auction...');
      
      const currentTime = new Date().toISOString();
      
      console.log('Updating auction end time:', {
        auctionId: auction.id,
        newEndTime: currentTime
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/auctions/${auction.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            end_time: currentTime,
            updated_at: currentTime
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to end auction');
      }

      // Get the updated auction data
      const updatedAuctionResponse = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/auctions/item/${id}`
      );

      if (!updatedAuctionResponse.ok) {
        throw new Error('Failed to fetch updated auction data');
      }

      const updatedAuctionData = await updatedAuctionResponse.json();
      setAuction(updatedAuctionData.data);

      // Update toast to success
      toast.update(loadingToast, { 
        render: 'Auction ended successfully', 
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });

    } catch (error) {
      console.error('Error ending auction:', error);
      toast.error(`Failed to end auction: ${error.message}`);
    }
  };

  // Main data loading effect
  useEffect(() => {
    async function loadAuctionItem() {
      try {
        setLoading(true);
        
        // Phase 1: Fetch item from external API
        const allItems = await fetchAuctions();
        const selectedItem = allItems.find((item) => item.id === parseInt(id));
        
        if (!selectedItem) {
          throw new Error("Item not found");
        }
        setItem(selectedItem);

        // Phase 2: Sync item to local database
        const syncResponse = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/items/sync`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(selectedItem),
          }
        );

        if (!syncResponse.ok) {
          throw new Error('Failed to sync item data');
        }

        // Phase 3: Create or retrieve auction
        const auctionResponse = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/auctions/item/${id}`
        );
        
        let auctionData;
        
        if (!auctionResponse.ok) {
          // Create new auction if none exists
          console.log('Creating new auction for item:', selectedItem.id);
          const createResponse = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/auctions`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                item_id: selectedItem.id,
                start_time: new Date().toISOString(),
                end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                current_bid: selectedItem.price
              }),
            }
          );

          if (!createResponse.ok) {
            const errorData = await createResponse.json();
            throw new Error(errorData.message || 'Failed to create auction');
          }

          auctionData = await createResponse.json();
        } else {
          auctionData = await auctionResponse.json();
        }

        if (auctionData && auctionData.data) {
          setAuction(auctionData.data);
        }

        // Phase 4: Check watchlist status for authenticated users
        if (isAuthenticated && user?.sub) {
          const userResponse = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/users/auth0/${user.sub}`
          );
          const userData = await userResponse.json();
          if (userData.data?.id) {
            await checkWatchlistStatus(userData.data.id, id);
          }
        }
      } catch (error) {
        console.error("Failed to load auction item:", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadAuctionItem();
  }, [id, isAuthenticated, user]);

  // Watchlist toggle handler
  const toggleWatchlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to your watchlist');
      return;
    }

    try {
      setWatchlistLoading(true);

      // Get user's database ID
      const userResponse = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/users/auth0/${user.sub}`
      );
      const userData = await userResponse.json();
      const userId = userData.data?.id;

      if (!userId) {
        throw new Error('User ID not found');
      }

      // Toggle watchlist status
      const method = isWatched ? 'DELETE' : 'POST';
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/watchlist/${userId}/${id}`,
        { method }
      );

      if (!response.ok) {
        throw new Error('Failed to update watchlist');
      }

      setIsWatched(!isWatched);
      toast.success(isWatched ? 'Removed from watchlist' : 'Added to watchlist');
    } catch (error) {
      console.error('Error updating watchlist:', error);
      toast.error(error.message);
    } finally {
      setWatchlistLoading(false);
    }
  };

  // Bid modal handlers
  const openBidModal = () => {
    if (auction) {
      setIsBidModalOpen(true);
    }
  };

  const closeBidModal = () => {
    setIsBidModalOpen(false);
  };

  // Bid success handler
  const handleBidSuccess = async (newBidAmount) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/auctions/item/${id}`
      );
      const updatedAuction = await response.json();
      setAuction(updatedAuction.data);
      toast.success(`Bid of £${newBidAmount.toFixed(2)} placed successfully!`);
    } catch (error) {
      console.error("Failed to refresh auction data:", error);
    }
  };

  // Loading state
  if (loading || !item) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-800 dark:text-gray-200 text-lg font-medium">
          Loading...
        </div>
      </div>
    );
  }

  // Data formatting
  const currentPrice = auction ? Number(auction.current_bid) || Number(item.price) : Number(item.price);
  const startingPrice = Number(item.price);
  const startTime = auction ? new Date(auction.start_time) : new Date();
  const endTime = auction ? new Date(auction.end_time) : new Date();
  const timeLeft = endTime - new Date();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

  const isAuctionEnded = timeLeft <= 0;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Test End Auction Button - Moved to top right */}
      {!isAuctionEnded && auction && (
        <div className="flex justify-end mb-2">
          <button
            onClick={handleEndAuction}
            className="btn btn-ghost btn-xs text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 gap-1"
            title="End auction (for testing)"
          >
            <StopCircle className="h-3 w-3" />
            <span className="text-xs">Test: End Auction</span>
          </button>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost gap-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary mb-6"
      >
        <ArrowLeft size={20} />
        Back to Previous Page
      </button>

      <div className="bg-base-200 rounded-lg p-6 shadow-lg">
        {/* Title with Watchlist */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">
            {item.title}
          </h2>
          {/* Watchlist Button Only */}
          {isAuthenticated && (
            <button
              onClick={toggleWatchlist}
              disabled={watchlistLoading || !isAuthenticated}
              className={`btn btn-circle btn-ghost ${
                isWatched ? 'text-red-500' : 'text-gray-400'
              }`}
              title={isAuthenticated ? (isWatched ? 'Remove from watchlist' : 'Add to watchlist') : 'Log in to add to watchlist'}
            >
              {watchlistLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Heart className={`h-6 w-6 ${isWatched ? 'fill-current' : ''}`} />
              )}
            </button>
          )}
        </div>

        {/* Auction Status Badge */}
        <div className="mb-4">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
              ${isAuctionEnded 
                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              }`}
          >
            {isAuctionEnded ? (
              <>
                <StopCircle className="h-4 w-4" />
                Auction Ended
              </>
            ) : (
              <>
                <Clock className="h-4 w-4" />
                {`${daysLeft} days remaining`}
              </>
            )}
          </div>
        </div>

        {/* Image */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 flex justify-center">
          <img 
            src={item.image} 
            alt={item.title} 
            className="max-w-[300px] max-h-[300px] object-contain"
          />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            {/* Current/Final Price */}
            <div className="flex items-center justify-between sm:justify-start sm:gap-4">
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                {isAuctionEnded ? 'Final Price:' : 'Current Bid:'}
              </span>
              <span className={`text-lg font-bold ${
                isAuctionEnded 
                  ? 'text-gray-800 dark:text-gray-200' 
                  : 'text-success'
              }`}>
                £{currentPrice.toFixed(2)}
              </span>
            </div>

            {/* Starting Price */}
            <div className="flex items-center justify-between sm:justify-start sm:gap-4">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Starting Price:</span>
              <span className="text-gray-800 dark:text-gray-200 font-medium">
                £{startingPrice.toFixed(2)}
              </span>
            </div>

            {/* Category */}
            <div className="flex items-center justify-between sm:justify-start sm:gap-4">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Category:</span>
              <span className="text-primary font-medium">{item.category}</span>
            </div>

            {/* Rating */}
            {item.rating && (
              <div className="flex items-center justify-between sm:justify-start sm:gap-4">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Rating:</span>
                <div className="flex items-center gap-2">
                  <Star className="text-warning h-5 w-5 fill-current" />
                  <span className="text-warning font-medium">
                    {item.rating.rate}
                    <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">
                      ({item.rating.count} reviews)
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Description
          </h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Auction Details */}
        {auction && (
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Auction Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Start Time:</span>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {startTime.toLocaleDateString()} {startTime.toLocaleTimeString()}
                </p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">End Time:</span>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {endTime.toLocaleDateString()} {endTime.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={openBidModal}
            className="btn btn-primary btn-lg flex-1"
            disabled={isAuctionEnded}
          >
            {isAuctionEnded ? 'Auction Ended' : 'Place Bid'}
          </button>
        </div>
      </div>

      {/* Bid Modal */}
      {isBidModalOpen && (
        <BidModal
          currentPrice={currentPrice}
          itemId={auction?.id}
          onClose={closeBidModal}
          onSuccess={handleBidSuccess}
        />
      )}
    </div>
  );
}

export default AuctionDetailsPage;