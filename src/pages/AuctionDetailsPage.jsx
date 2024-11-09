import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAuctions } from "../services/api";
import BidModal from "../components/BidModal";
import { useTheme } from "../contexts/ThemeContext";
import { ArrowLeft, Star } from "lucide-react";

function AuctionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    async function loadAuctionItem() {
      try {
        const allItems = await fetchAuctions();
        const selectedItem = allItems.find((auction) => auction.id === parseInt(id));
        if (!selectedItem) {
          throw new Error("Item not found");
        }
        setItem(selectedItem);
      } catch (error) {
        console.error("Failed to load auction item:", error);
      }
    }
    loadAuctionItem();
  }, [id]);

  const openBidModal = () => {
    if (item?.price) {
      setIsBidModalOpen(true);
    }
  };

  const closeBidModal = () => {
    setIsBidModalOpen(false);
  };

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-800 dark:text-gray-200 text-lg font-medium">
          Loading...
        </div>
      </div>
    );
  }

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
            {/* Price */}
            <div className="flex items-center justify-between sm:justify-start sm:gap-4">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Price:</span>
              <span className="text-success text-lg font-bold">£{item.price.toFixed(2)}</span>
            </div>

            {/* Category */}
            <div className="flex items-center justify-between sm:justify-start sm:gap-4">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Category:</span>
              <span className="text-primary font-medium">{item.category}</span>
            </div>

            {/* Rating */}
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
          currentPrice={item.price}
          onClose={closeBidModal}
        />
      )}
    </div>
  );
}

export default AuctionDetailsPage;