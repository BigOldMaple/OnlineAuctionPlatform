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
  Hammer
} from "lucide-react";

const BiddedItemsPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [biddedItems, setBiddedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchBiddedItems = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/bids/${user.sub}`);
          const data = await response.json();
          if (response.ok && data.length) {
            setBiddedItems(data);
          } else {
            setBiddedItems([]);
          }
        } catch (err) {
          setError("Failed to load bidded items");
        } finally {
          setLoading(false);
        }
      };
      fetchBiddedItems();
    }
  }, [isAuthenticated, user]);

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
            Please log in to view your bidded items and track your auction activity.
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
            Loading your bidded items...
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
            Error Loading Items
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {error}
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (biddedItems.length === 0) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-base-200 rounded-xl shadow-lg">
          <Package className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            No Bidded Items Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start exploring auctions and place your first bid!
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
            Your Bidded Items
          </h1>
          <Link to="/auctions" className="btn btn-outline btn-sm">
            Browse More
          </Link>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {biddedItems.map((item) => (
            <div 
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all duration-200
                hover:shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Item Image */}
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                    {item.image ? (
                      <img 
                        src={item.image} 
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
                        <Hammer className="h-4 w-4 mr-1" />
                        Your Bid: £{item.bidAmount}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {item.bidDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* View Details Link */}
                <Link 
                  to={`/auction/${item.id}`}
                  className="btn btn-ghost btn-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BiddedItemsPage;