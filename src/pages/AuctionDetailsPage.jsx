import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAuctions } from "../services/api";
import BidModal from "../components/BidModal";
import { useTheme } from "../contexts/ThemeContext";
import { ArrowLeft, Star, Clock } from "lucide-react";
import { toast } from "react-toastify";

function AuctionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [auction, setAuction] = useState(null);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    async function loadAuctionItem() {
      try {
        setLoading(true);
        // First fetch item from Fake Store API
        const allItems = await fetchAuctions();
        const selectedItem = allItems.find((item) => item.id === parseInt(id));
        
        if (!selectedItem) {
          throw new Error("Item not found");
        }
        setItem(selectedItem);

        // First sync the item to our database
        const syncResponse = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/items/sync`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(selectedItem),
          }
        );

        if (!syncResponse.ok) {
          throw new Error('Failed to sync item data');
        }

        // Then check if an auction exists for this item
        const auctionResponse = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/auctions/item/${id}`
        );
        
        let auctionData;
        
        if (!auctionResponse.ok) {
          console.log('Creating new auction for item:', selectedItem.id);
          const createResponse = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/auctions`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
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
          console.log('Created new auction:', auctionData);
        } else {
          auctionData = await auctionResponse.json();
          console.log('Found existing auction:', auctionData);
        }

        if (auctionData && auctionData.data) {
          setAuction(auctionData.data);
        }
      } catch (error) {
        console.error("Failed to load auction item:", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadAuctionItem();
  }, [id]);

  const openBidModal = () => {
    if (auction) {
      setIsBidModalOpen(true);
    }
  };

  const closeBidModal = () => {
    setIsBidModalOpen(false);
  };

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

  if (loading || !item) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-800 dark:text-gray-200 text-lg font-medium">
          Loading...
        </div>
      </div>
    );
  }

  // Ensure price values are numbers
  const currentPrice = auction ? Number(auction.current_bid) || Number(item.price) : Number(item.price);
  const startingPrice = Number(item.price);

  // Format dates
  const startTime = auction ? new Date(auction.start_time) : new Date();
  const endTime = auction ? new Date(auction.end_time) : new Date();
  const timeLeft = endTime - new Date();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost gap-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary mb-6"
      >
        <ArrowLeft size={20} />
        Back to Previous Page
      </button>

      <div className="bg-base-200 rounded-lg p-6 shadow-lg">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          {item.title}
        </h2>

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
            {/* Current Bid */}
            <div className="flex items-center justify-between sm:justify-start sm:gap-4">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Current Bid:</span>
              <span className="text-success text-lg font-bold">
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

            {/* Time Left */}
            <div className="flex items-center justify-between sm:justify-start sm:gap-4">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Time Left:</span>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-primary font-medium">
                  {daysLeft} days
                </span>
              </div>
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

        {/* Bid Button */}
        <button
          onClick={openBidModal}
          className="btn btn-primary btn-lg w-full sm:w-auto"
        >
          Place Bid
        </button>
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