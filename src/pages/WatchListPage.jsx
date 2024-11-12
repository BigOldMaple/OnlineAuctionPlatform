/**
 * WatchListPage Component
 * 
 * A user interface for viewing and managing watched auction items.
 * 
 * Features:
 * - Display of watched items
 * - Remove items from watchlist
 * - Current bid tracking
 * - End time display
 * - Quick navigation to auctions
 * - Multiple state handling
 * - Dark/light mode support
 * 
 * Dependencies:
 * - Auth0: User authentication
 * - API Integration: Users and watchlist endpoints
 * - Router: Navigation and linking
 * - Lucide Icons: UI elements
 * 
 * Data Flow:
 * 1. Authenticates user via Auth0
 * 2. Fetches user's database ID
 * 3. Retrieves watchlist items
 * 4. Manages watchlist updates
 * 
 * State Management:
 * - Authentication state from Auth0
 * - Local loading and error states
 * - Watchlist items state
 */

import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { 
  Loader2, 
  AlertCircle, 
  LogIn, 
  Package, 
  Clock,
  ExternalLink,
  Heart,
  StopCircle
} from "lucide-react";
import { toast } from "react-toastify";

const WatchListPage = () => {
  // Auth0 hooks
  const { user, isAuthenticated, isLoading } = useAuth0();
  
  // Local state management
  const [watchedItems, setWatchedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to check if auction has ended
  const isAuctionEnded = (endTime) => {
    return new Date(endTime) <= new Date();
  };

  // Helper function to format remaining time or show ended status
  const formatTimeStatus = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const timeLeft = end - now;

    if (timeLeft <= 0) {
      return { status: 'ended', text: 'Auction Ended' };
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return {
      status: 'active',
      text: days > 0 ? `${days}d ${hours}h remaining` : `${hours}h remaining`
    };
  };

  // Fetch watchlist data
  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      const fetchWatchedItems = async () => {
        try {
          setLoading(true);
          
          // Phase 1: Get user's database ID
          const userResponse = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/users/auth0/${user.sub}`
          );
          
          if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
          }

          const userData = await userResponse.json();
          const userId = userData.data?.id;

          // Phase 2: Fetch watchlist items
          const watchlistResponse = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/watchlist/${userId}`
          );
          
          if (!watchlistResponse.ok) {
            throw new Error('Failed to fetch watchlist');
          }

          const data = await watchlistResponse.json();
          setWatchedItems(data.data || []);
        } catch (err) {
          console.error('Error fetching watchlist:', err);
          setError("Failed to load watched items");
          toast.error("Failed to load your watchlist. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      fetchWatchedItems();
    }
  }, [isAuthenticated, user]);

  /**
   * Removes an item from the user's watchlist
   * @param {string} itemId - ID of the item to remove
   */
  const removeFromWatchlist = async (itemId) => {
    try {
      // Get user's database ID
      const userResponse = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/users/auth0/${user.sub}`
      );
      const userData = await userResponse.json();
      const userId = userData.data?.id;

      // Remove item from watchlist
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/watchlist/${userId}/${itemId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        // Update local state to remove item
        setWatchedItems(current => current.filter(item => item.id !== itemId));
        toast.success("Item removed from watchlist");
      } else {
        throw new Error('Failed to remove item from watchlist');
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      toast.error("Failed to remove item from watchlist");
    }
  };

  // Authentication loading state
  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">
            Verifying authentication...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-base-200 rounded-xl shadow-lg">
          <LogIn className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please log in to view your watchlist and track your favorite auctions.
          </p>
          <button 
            onClick={() => window.location.href = "/login"}
            className="btn btn-primary"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  // Data loading state
  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">
            Loading your watchlist...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-base-200 rounded-xl shadow-lg">
          <AlertCircle className="h-12 w-12 text-error mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Error Loading Watchlist
          </h2>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary mt-4"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty watchlist state
  if (watchedItems.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-base-200 rounded-xl shadow-lg">
          <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Your Watchlist is Empty
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start adding items to your watchlist to keep track of your favorite auctions!
          </p>
          <Link to="/auctions" className="btn btn-primary">
            Browse Auctions
          </Link>
        </div>
      </div>
    );
  }

  // Main content with items
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Your Watchlist
          </h1>
          <Link to="/auctions" className="btn btn-outline btn-sm">
            Browse More
          </Link>
        </div>

        {/* Watchlist Items */}
        <div className="space-y-4">
          {watchedItems.map((item) => {
            const timeStatus = formatTimeStatus(item.end_time);
            const ended = timeStatus.status === 'ended';
            
            return (
              <div 
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all duration-200
                  hover:shadow-lg border border-gray-200 dark:border-gray-700
                  relative"
              >
                {/* Auction Status Badge */}
                <div
                  className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium
                    flex items-center gap-1
                    ${ended 
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                      : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}
                >
                  {ended ? (
                    <>
                      <StopCircle className="h-3 w-3" />
                      Ended
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3" />
                      {timeStatus.text}
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  {/* Item Information */}
                  <div className="flex items-center space-x-4">
                    {/* Item Image */}
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <Package className="h-8 w-8 text-gray-400" />
                      )}
                    </div>

                    {/* Item Details */}
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                        {item.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                        <span className="flex items-center">
                          {ended ? (
                            <span className="flex items-center">
                              Final Price: £{Number(item.current_bid).toFixed(2)}
                            </span>
                          ) : (
                            <span className="flex items-center">
                              Current Bid: £{Number(item.current_bid).toFixed(2)}
                            </span>
                          )}
                        </span>
                        {!ended && (
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Ends: {new Date(item.end_time).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFromWatchlist(item.id)}
                      className="btn btn-ghost btn-sm"
                      title="Remove from watchlist"
                    >
                      <Heart className="h-4 w-4 fill-current text-red-500" />
                    </button>
                    <Link 
                      to={`/auction/${item.item_id}`}
                      className="btn btn-ghost btn-sm"
                      title="View auction"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WatchListPage;