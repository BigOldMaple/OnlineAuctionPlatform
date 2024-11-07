import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function BidModal({ currentPrice, onClose, onSubmit }) {
  const [bidAmount, setBidAmount] = useState("");
  const [reviewMode, setReviewMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const minimumBid = parseFloat((currentPrice + 0.01).toFixed(2)); // Minimum bid amount

  const handleBidChange = (e) => {
    const input = e.target.value;

    // Allow only valid numbers with up to two decimal places
    if (/^\d*\.?\d{0,2}$/.test(input)) {
      setBidAmount(input);
      setErrorMessage(""); // Clear any previous error message
    } else if (/[^\d.]/.test(input)) {
      setErrorMessage("Please enter a valid number.");
    }
  };

  const handleReview = () => {
    const bidValue = parseFloat(parseFloat(bidAmount).toFixed(2)); // Round to two decimal places

    if (bidValue && bidValue >= minimumBid) {
      setReviewMode(true);
      setErrorMessage(""); // Clear any previous error message
    } else if (!bidValue || bidValue < minimumBid) {
      setErrorMessage(`Your bid must be at least £${minimumBid.toFixed(2)}`);
    }
  };

  const handleEditBid = () => {
    setReviewMode(false);
  };

  const handleConfirmBid = () => {
    onSubmit(bidAmount);
    setReviewMode(false);
    onClose();
  };

  const modalVariants = {
    initial: { opacity: 0, scale: 0.9 },
    enter: { opacity: 1, scale: 1, transition: { duration: 0.1 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.1 } },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        onClick={onClose}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={modalVariants}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-800 rounded-lg p-6 w-80 text-white relative flex flex-col justify-between"
          animate={{ height: reviewMode ? "300px" : "240px" }}
          transition={{ duration: 0.15 }}
        >
          {/* Close Icon */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
          >
            ✕
          </button>

          <div className="flex-1">
            {!reviewMode ? (
              <div>
                <h2 className="text-lg font-semibold mb-2 text-left">Place Your Bid</h2>
                <p className="mb-2 text-left">Current Price: £{currentPrice.toFixed(2)}</p>
                <div className="flex items-center">
                  <span className="text-gray-300 mr-1">£</span>
                  <input
                    type="text"
                    value={bidAmount}
                    onChange={handleBidChange}
                    placeholder="Enter bid amount"
                    className="p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none w-full"
                    min={minimumBid.toFixed(2)}
                    step="0.01"
                  />
                </div>
                {errorMessage && (
                  <p className="text-red-500 mt-2 text-sm text-left">{errorMessage}</p>
                )}
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold mb-2 text-left">Review Your Bid</h2>
                <p className="text-left mb-2">Current Price: £{currentPrice.toFixed(2)}</p>
                <p className="text-left mb-4">Your Bid: £{parseFloat(bidAmount).toFixed(2)}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-4">
            {reviewMode ? (
              <>
                <button
                  onClick={handleEditBid}
                  className="text-blue-400 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={handleConfirmBid}
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                >
                  Confirm
                </button>
              </>
            ) : (
              <button
                onClick={handleReview}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full"
              >
                Review Bid
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default BidModal;
