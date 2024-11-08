// src/components/Navbar.jsx

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingBasket, FaChevronDown, FaChevronUp } from "react-icons/fa";
import SearchBar from "./SearchBar";
import { useAuth0 } from "@auth0/auth0-react";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  // Auth0 hooks for authentication
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } =
    useAuth0();

  console.log({
    isAuthenticated,
    user,
    isLoading,
  });

  const categories = [
    "Electronics",
    "Women's Clothing",
    "Men's Clothing",
    "Jewelry",
    "Home",
    "Books",
    "Toys",
    "Sports",
  ];

  return (
    <nav className="bg-[#242424] p-6">
      <div className="flex justify-between items-center w-full px-4">
        {/* Left: Site name, Categories, and Search Bar */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-white text-2xl font-bold">
            Auction Site
          </Link>

          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="btn btn-ghost text-gray-200 hover:bg-gray-700 flex items-center"
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
                onMouseLeave={closeDropdown}
              >
                <ul className="py-2">
                  {categories.map((category) => (
                    <li key={category}>
                      <Link
                        to={`/results?category=${category.toLowerCase()}`}
                        className="block px-4 py-2 text-white hover:bg-gray-600"
                        onClick={closeDropdown}
                      >
                        {category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <SearchBar />
        </div>

        {/* Right: Other Links */}
        <div className="navbar-end flex items-center space-x-4">
          <Link
            to="/auctions"
            className="btn btn-ghost text-gray-200 hover:bg-gray-700"
          >
            Auction List
          </Link>
          <Link
            to="/bids"
            className="btn btn-ghost text-gray-200 hover:bg-gray-700"
          >
            <FaShoppingBasket size={24} />
          </Link>

          {/* Auth and User Info */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div>Loading...</div> // Display loading state until Auth0 is ready
            ) : isAuthenticated ? (
              <>
                {/* User info display */}
                {user && (
                  <>
                    <img
                      src={user.picture}
                      alt="User Profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-white font-medium">
                      {user.nickname}
                    </span>
                  </>
                )}
                <button
                  onClick={() => logout({ returnTo: window.location.origin })}
                  className="btn btn-ghost text-gray-200 hover:bg-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={loginWithRedirect}
                className="btn btn-ghost text-gray-200 hover:bg-gray-700"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
