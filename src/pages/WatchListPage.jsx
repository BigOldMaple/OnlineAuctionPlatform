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
  Heart
} from "lucide-react";

const WatchListPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [watchedItems, setWatchedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      const fetchWatchedItems = async () => {
        try {
          setLoading(true);
          
          // First get user's database ID
          const userResponse = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/users/auth0/${user.sub}`
          );
          
          if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
          }

          const userData = await userResponse.json();
          const userId = userData.data?.id;

          // Then fetch watched items
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
        } finally {
          setLoading(false);
        }
      };

      fetchWatchedItems();
    }
  }, [isAuthenticated, user]);

  const removeFromWatchlist = async (itemId) => {
    try {
      const userResponse = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/users/auth0/${user.sub}`
      );
      const userData = await userResponse.json();
      const userId = userData.data?.id;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/watchlist/${userId}/${itemId}`,
        {
          method: 'DELETE'
        }
      );

      if (response.ok) {
        setWatchedItems(current => current.filter(item => item.id !== itemId));
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  // Auth loading state
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

  // Loading state
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
          <p className="text-gray-600 dark:text-gray-300">
            {error}
          </p>
        </div>
      </div>
    );
  }

  // Empty state
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

  // Main content
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
            Your Watchlist
          </h1>
          <Link to="/auctions" className="btn btn-outline btn-sm">
            Browse More
          </Link>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {watchedItems.map((item) => (
            <div 
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all duration-200
                hover:shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
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
                        <Clock className="h-4 w-4 mr-1" />
                        Current Bid: £{Number(item.current_bid).toFixed(2)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Ends: {new Date(item.end_time).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchListPage;