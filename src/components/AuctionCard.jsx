// AuctionCard.jsx
// This component renders an auction card displaying an item's image, title, description, current bid, 
// starting price, category, and rating. It fetches auction data, syncs the item to the database if needed, 
// and creates an auction if none exists for the item. The current price is displayed from the auction data
// or falls back to the item price. The price is formatted as a number with 2 decimal places. The component

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { Star, Loader2, Clock, StopCircle } from "lucide-react";

function AuctionCard({ item }) {
  const { isDarkMode } = useTheme();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchAuctionData() {
      try {
        // First sync the item to the database
        await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/items/sync`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
          }
        );

        // Then fetch auction data
        const auctionResponse = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/auctions/item/${item.id}`
        );
        
        let auctionData;
        
        if (!auctionResponse.ok) {
          // Create new auction if one doesn't exist
          const createResponse = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/auctions`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                item_id: item.id,
                start_time: new Date().toISOString(),
                end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                current_bid: item.price
              }),
            }
          );

          if (!createResponse.ok) {
            throw new Error('Failed to create auction');
          }

          auctionData = await createResponse.json();
        } else {
          auctionData = await auctionResponse.json();
        }

        if (auctionData && auctionData.data) {
          setAuction(auctionData.data);
        }
      } catch (error) {
        console.error("Failed to load auction data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAuctionData();
  }, [item.id, item.price]);

  // Format price as number with 2 decimal places
  const formatPrice = (price) => Number(price).toFixed(2);
  
  // Get current price from auction or fall back to item price
  const currentPrice = auction ? Number(auction.current_bid) || Number(item.price) : Number(item.price);
  const startingPrice = Number(item.price);

  // Calculate if auction has ended
  const isAuctionEnded = auction ? new Date(auction.end_time) <= new Date() : false;

  // Calculate time remaining
  const getTimeRemaining = () => {
    if (!auction) return null;
    
    const endTime = new Date(auction.end_time);
    const now = new Date();
    const timeLeft = endTime - now;
    
    if (timeLeft <= 0) return 'Ended';
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
  };

  return (
    <Link
      to={`/auction/${item.id}`}
      className="w-72 h-96 p-4 rounded-lg shadow-lg flex flex-col
        transform transition-all duration-200
        hover:scale-105
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        hover:shadow-xl hover:bg-gray-50 dark:hover:bg-gray-700
        relative"
    >
      {/* Auction Status Badge */}
      {!loading && auction && (
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium
            flex items-center gap-1
            ${isAuctionEnded 
              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
              : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
            }`}
        >
          {isAuctionEnded ? (
            <>
              <StopCircle className="h-3 w-3" />
              Ended
            </>
          ) : (
            <>
              <Clock className="h-3 w-3" />
              {getTimeRemaining()}
            </>
          )}
        </div>
      )}

      {/* Image Container */}
      <div className="h-48 flex justify-center items-center mb-4 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-900">
        <img
          src={item.image}
          alt={item.title}
          className="object-contain h-full w-full"
        />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 truncate">
        {item.title}
      </h3>

      {/* Description */}
      <p
        className="text-gray-600 dark:text-gray-300 mt-2 overflow-hidden text-sm"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical"
        }}
      >
        {item.description}
      </p>

      {/* Details Section */}
      <div className="mt-auto space-y-2">
        {/* Current Bid */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            {isAuctionEnded ? 'Final Price:' : 'Current Bid:'}
          </span>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-emerald-600 dark:text-emerald-400" />
          ) : (
            <span className={`font-bold ${
              isAuctionEnded 
                ? 'text-gray-800 dark:text-gray-200' 
                : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              £{formatPrice(currentPrice)}
            </span>
          )}
        </div>

        {/* Starting Price */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Starting Price:</span>
          <span className="text-gray-500 dark:text-gray-400 font-medium">
            £{formatPrice(startingPrice)}
          </span>
        </div>

        {/* Category */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Category:</span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {item.category}
          </span>
        </div>

        {/* Rating */}
        {item.rating && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Rating:</span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-amber-500 fill-current" />
              <span className="text-amber-500">
                {item.rating.rate}
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                  ({item.rating.count})
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

export default AuctionCard;