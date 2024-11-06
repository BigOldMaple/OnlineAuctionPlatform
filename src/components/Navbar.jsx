// src/components/Navbar.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingBasket } from "react-icons/fa";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Import chevron icons

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const categories = ["Electronics", "women's clothing", "men's clothing", "jewelery", "Home", "Books", "Toys", "Sports"];

  return (
    <nav className="bg-gray-800 p-4 relative">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          Auction Site
        </Link>
        
        <div className="flex space-x-4 items-center">
          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="text-white hover:text-gray-400 focus:outline-none flex items-center"
            >
              Categories
              {dropdownOpen ? (
                <FaChevronUp className="ml-1" />
              ) : (
                <FaChevronDown className="ml-1" />
              )}
            </button>
            {dropdownOpen && (
              <div
                className="absolute top-full mt-2 w-40 bg-gray-700 shadow-lg rounded-lg z-10"
                onMouseLeave={closeDropdown} // Close dropdown when mouse leaves
              >
                <ul className="py-2">
                  {categories.map((category) => (
                    <li key={category}>
                      <Link
                        to={`/results?category=${category.toLowerCase()}`}
                        className="block px-4 py-2 text-white hover:bg-gray-600"
                        onClick={closeDropdown} // Close dropdown on link click
                      >
                        {category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Link to="/auctions" className="text-white hover:text-gray-400">
            Auction List
          </Link>
          <Link to="/login" className="text-white hover:text-gray-400">
            Login
          </Link>
          <Link to="/bids" className="text-white hover:text-gray-400">
            <FaShoppingBasket size={24} />
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
