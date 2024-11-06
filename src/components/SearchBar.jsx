// src/components/SearchBar.jsx

import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const navigate = useNavigate();

  // Function to fetch suggestions based on the current query
  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(`https://fakestoreapi.com/products`);
      const items = response.data;

      // Filter items based on the query
      const filteredItems = items.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );

      setSuggestions(filteredItems.slice(0, 5)); // Limit to top 5 suggestions
      setIsSuggestionsVisible(filteredItems.length > 0); // Show dropdown only if there are suggestions
    } catch (error) {
      console.error("Error fetching items for suggestions:", error);
    }
  };

  // Debounced function to reduce the frequency of API calls
  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), []);

  // Handle changes in the search bar input
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      debouncedFetchSuggestions(query);
    } else {
      setIsSuggestionsVisible(false); // Hide dropdown if the input is empty
    }
  };

  // Handle clicking a suggestion
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(""); // Clear search bar after clicking a suggestion
    setIsSuggestionsVisible(false); // Hide suggestions
    navigate(`/auction/${suggestion.id}`);
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); // Clear search bar after submission
      setIsSuggestionsVisible(false); // Hide suggestions
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="relative w-80 md:w-96">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search auctions..."
        className="p-2 w-full rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
      />
      <button type="submit" className="absolute right-0 top-0 h-full p-2 text-white hover:text-gray-400">
        🔍
      </button>

      {isSuggestionsVisible && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-gray-700 shadow-lg rounded-lg z-10">
          <ul className="py-2">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 cursor-pointer text-white hover:bg-gray-600"
              >
                {suggestion.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}

export default SearchBar;
