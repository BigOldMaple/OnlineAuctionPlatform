// src/pages/ResultsPage.jsx

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchAuctions } from "../services/api";
import AuctionCard from "../components/AuctionCard";

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get query parameters from URL
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";
  const category = queryParams.get("category") || "";

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      const items = await fetchAuctions();

      // Filter items by search query or category
      const filteredItems = items.filter((item) => {
        if (searchQuery) {
          return item.title.toLowerCase().includes(searchQuery.toLowerCase());
        }
        if (category) {
          return item.category.toLowerCase() === category.toLowerCase();
        }
        return true;
      });

      setResults(filteredItems);
      setLoading(false);
    }

    fetchResults();
  }, [searchQuery, category]);

  return (
    <div className="container mx-auto p-6 text-white">
      {/* Back to Previous Page Link */}
      <button
        onClick={() => navigate(-1)}
        className="text-blue-400 hover:underline mb-4"
      >
        ← Back to Previous Page
      </button>

      <h2 className="text-3xl font-bold mb-6">
        {searchQuery ? `Results for "${searchQuery}"` : `Browsing category: ${category}`}
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {results.map((item) => (
            <AuctionCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p>No items found.</p>
      )}
    </div>
  );
}

export default ResultsPage;
