// BidModal.jsx
// This component provides a modal for placing a bid on an auction item. It includes fields to 
// enter a bid amount, a review mode for confirming the bid, and error handling. It uses Auth0 for 
// authentication, Framer Motion for animations, and React Toastify for success notifications.

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react"; 
import { 
  X, 
  AlertCircle, 
  CheckCircle,
  ArrowLeft,
  Loader2,
  PoundSterling
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "react-toastify";

function BidModal({ currentPrice, itemId, onClose }) {
  const [bidAmount, setBidAmount] = useState("");
  const [reviewMode, setReviewMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const minimumBid = parseFloat((currentPrice + 0.01).toFixed(2));
  const { isDarkMode } = useTheme();
  const { user, isAuthenticated } = useAuth0();

  // Focus trap
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleBidChange = (e) => {
    const input = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(input)) {
      setBidAmount(input);
      setErrorMessage("");
    }
  };

  const handleReview = () => {
    if (!isAuthenticated) {
      setErrorMessage("Please log in to place a bid");
      return;
    }

    const bidValue = parseFloat(parseFloat(bidAmount).toFixed(2));
    
    if (!bidAmount) {
      setErrorMessage("Please enter a bid amount");
      return;
    }

    if (bidValue && bidValue >= minimumBid) {
      setReviewMode(true);
      setErrorMessage("");
    } else {
      setErrorMessage(`Minimum bid must be £${minimumBid.toFixed(2)}`);
    }
  };

  const handleConfirmBid = async () => {
    try {
      setIsSubmitting(true);
      
      // Get user's Auth0 ID
      const auth0Id = user?.sub;
      if (!auth0Id) {
        throw new Error("You must be logged in to place a bid");
      }
  
      console.log('Attempting to fetch user data for auth0Id:', auth0Id);
      // First get the user's database ID using their Auth0 ID
      const userResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/users/auth0/${auth0Id}`);
      const userResponseData = await userResponse.json();
      console.log('User response:', userResponseData);
  
      if (!userResponse.ok) {
        throw new Error(`Failed to fetch user information: ${userResponseData.message || 'Unknown error'}`);
      }
  
      const userId = userResponseData.data?.id;
      if (!userId) {
        throw new Error('Could not determine user ID');
      }
  
      console.log('Attempting to place bid with data:', {
        auction_id: itemId,
        user_id: userId,
        bid_amount: parseFloat(bidAmount)
      });
  
      // Submit the bid
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auction_id: itemId,
          user_id: userId,
          bid_amount: parseFloat(bidAmount)
        }),
      });
  
      const responseData = await response.json();
      console.log('Bid response:', responseData);
  
      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || 'Failed to place bid');
      }
  
      toast.success(`Bid of £${parseFloat(bidAmount).toFixed(2)} placed successfully!`);
      onClose();
    } catch (error) {
      console.error('Detailed error placing bid:', error);
      setErrorMessage(error.message || 'Failed to place bid');
      setIsSubmitting(false);
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 500 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
        onClick={onClose}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={overlayVariants}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className={`
            w-full max-w-md mx-4 rounded-xl shadow-2xl 
            ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
            relative overflow-hidden
          `}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <div className={`
            px-6 py-4 border-b
            ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <div className="flex justify-between items-center">
              <h2 className={`text-xl font-semibold
                ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}
              `}>
                {reviewMode ? 'Review Your Bid' : 'Place Your Bid'}
              </h2>
              <button
                onClick={onClose}
                className={`p-1 rounded-lg transition-colors
                  ${isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}
                `}
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Current Price Info */}
            <div className={`
              mb-6 p-4 rounded-lg
              ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}
            `}>
              <div className="flex justify-between items-center">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Current Price
                </span>
                <span className={`text-lg font-semibold
                  ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}
                `}>
                  £{currentPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {!reviewMode ? (
              <>
                {/* Bid Input */}
                <div className="space-y-4">
                  <label className={`block text-sm font-medium
                    ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    Your Bid Amount
                  </label>
                  <div className="relative">
                    <PoundSterling className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5
                      ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                    `} />
                    <input
                      type="text"
                      value={bidAmount}
                      onChange={handleBidChange}
                      placeholder="0.00"
                      className={`
                        w-full pl-10 pr-4 py-2 rounded-lg transition-colors
                        focus:ring-2 focus:ring-blue-500 focus:outline-none
                        ${isDarkMode 
                          ? 'bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600' 
                          : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'}
                        border
                      `}
                    />
                  </div>
                  
                  {/* Minimum Bid Info */}
                  <p className={`text-sm
                    ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    Minimum bid: £{minimumBid.toFixed(2)}
                  </p>
                </div>
              </>
            ) : (
              // Review Mode Content
              <div className="space-y-4">
                <div className={`
                  p-4 rounded-lg border
                  ${isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}
                `}>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                        Your Bid
                      </span>
                      <span className={`text-lg font-semibold
                        ${isDarkMode ? 'text-green-400' : 'text-green-600'}
                      `}>
                        £{parseFloat(bidAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className={`
                mt-4 p-3 rounded-lg flex items-center gap-2
                ${isDarkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-50 text-red-600'}
              `}>
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`
            px-6 py-4 border-t
            ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <div className="flex justify-end gap-3">
              {reviewMode ? (
                <>
                  <button
                    onClick={() => setReviewMode(false)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                      ${isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-100'}
                    `}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={handleConfirmBid}
                    disabled={isSubmitting}
                    className={`
                      flex items-center gap-2 px-6 py-2 rounded-lg
                      bg-green-600 hover:bg-green-700 text-white
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-colors
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Confirm Bid</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleReview}
                  className="
                    flex items-center gap-2 px-6 py-2 rounded-lg
                    bg-blue-600 hover:bg-blue-700 text-white
                    transition-colors w-full justify-center
                  "
                >
                  Review Bid
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default BidModal;