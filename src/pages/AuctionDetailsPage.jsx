// src/pages/AuctionDetailsPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAuctions } from "../services/api";
import BidModal from "../components/BidModal";

function AuctionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);

  useEffect(() => {
    async function loadAuctionItem() {
      const allItems = await fetchAuctions();
      const selectedItem = allItems.find((auction) => auction.id === parseInt(id));
      setItem(selectedItem);
    }

    loadAuctionItem();
  }, [id]);

  const openBidModal = () => {
    if (item && item.price) {
      setIsBidModalOpen(true);
    } else {
      console.error("Item or price is undefined, cannot open bid modal.");
    }
  };

  const closeBidModal = () => {
    setIsBidModalOpen(false);
  };

  if (!item) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 text-white">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-400 hover:underline mb-4 inline-block"
      >
        ← Back to Previous Page
      </button>

      <h2 className="text-4xl font-bold mb-4">{item.title}</h2>
      <img src={item.image} alt={item.title} className="w-96 mx-auto mb-4" />
      <p className="text-lg mb-2">Price: £{item.price.toFixed(2)}</p>
      <p className="text-lg mb-2">Category: {item.category}</p>
      <p className="text-yellow-400 mb-4">Rating: {item.rating.rate} ({item.rating.count} reviews)</p>
      <p className="text-gray-300">{item.description}</p>

      <button
        onClick={openBidModal}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Place Bid
      </button>

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
