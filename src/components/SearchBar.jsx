import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";
import { Search, Loader2, ArrowRight } from "lucide-react";

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Function to fetch suggestions based on the current query
  const fetchSuggestions = async (query) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://fakestoreapi.com/products`);
      const items = response.data;
      const filteredItems = items.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredItems.slice(0, 5));
      setIsSuggestionsVisible(filteredItems.length > 0);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 300),
    []
  );

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setIsSuggestionsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedIndex(-1);
    
    if (query.trim()) {
      debouncedFetchSuggestions(query);
    } else {
      setIsSuggestionsVisible(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery("");
    setIsSuggestionsVisible(false);
    navigate(`/auction/${suggestion.id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsSuggestionsVisible(false);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isSuggestionsVisible) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : prev);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex > -1) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearchSubmit(e);
        }
        break;
      case "Escape":
        setIsSuggestionsVisible(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <form 
        onSubmit={handleSearchSubmit}
        className="relative flex items-center"
      >
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            placeholder="Search auctions..."
            className="w-full h-10 pl-10 pr-12 rounded-lg
              bg-gray-800 dark:bg-gray-700
              text-gray-200 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-500
              border border-gray-700 dark:border-gray-600
              focus:outline-none focus:ring-2 focus:ring-primary
              transition-all duration-200"
            aria-label="Search auctions"
            aria-expanded={isSuggestionsVisible}
            role="combobox"
            aria-controls="search-suggestions"
            aria-activedescendant={selectedIndex > -1 ? `suggestion-${selectedIndex}` : undefined}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary animate-spin" />
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isSuggestionsVisible && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2
            bg-gray-800 dark:bg-gray-700
            border border-gray-700 dark:border-gray-600
            rounded-lg shadow-lg overflow-hidden z-50"
          id="search-suggestions"
          role="listbox"
        >
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.id}
                id={`suggestion-${index}`}
                role="option"
                aria-selected={selectedIndex === index}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`flex items-center justify-between px-4 py-2 cursor-pointer
                  ${selectedIndex === index 
                    ? 'bg-gray-700 dark:bg-gray-600 text-white' 
                    : 'text-gray-200 dark:text-gray-100 hover:bg-gray-700 dark:hover:bg-gray-600'}
                  transition-colors duration-150`}
              >
                <span className="truncate">{suggestion.title}</span>
                <ArrowRight className={`h-4 w-4 ml-2 
                  ${selectedIndex === index ? 'opacity-100' : 'opacity-0'} 
                  transition-opacity duration-150`}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchBar;