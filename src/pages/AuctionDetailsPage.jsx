// src/pages/AuctionDetailsPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchAuctions } from "../services/api";
import { placeBid } from "../features/bidsSlice";

function AuctionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadAuctionItem() {
      const allItems = await fetchAuctions();
      const selectedItem = allItems.find((auction) => auction.id === parseInt(id));
      setItem(selectedItem);
    }

    loadAuctionItem();
  }, [id]);

  const handlePlaceBid = () => {
    if (item) {
      dispatch(placeBid(item));
    }
  };

  if (!item) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 text-white">
      {/* Back to Previous Page Button */}
      <button
        onClick={() => navigate(-1)}
        className="text-blue-400 hover:underline mb-4 inline-block"
      >
        ← Back to Previous Page
      </button>

      <h2 className="text-4xl font-bold mb-4">{item.title}</h2>
      <img src={item.image} alt={item.title} className="w-96 mx-auto mb-4" />
      <p className="text-lg mb-2">Price: £{item.price}</p>
      <p className="text-lg mb-2">Category: {item.category}</p>
      <p className="text-yellow-400 mb-4">Rating: {item.rating.rate} ({item.rating.count} reviews)</p>
      <p className="text-gray-300">{item.description}</p>

      {/* Place Bid Button */}
      <button
        onClick={handlePlaceBid}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Place Bid
      </button>
    </div>
  );
}

export default AuctionDetailsPage;
