import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingBasket, FaChevronDown, FaChevronUp, FaBars, FaTimes } from "react-icons/fa";
import SearchBar from "./SearchBar";
import { useAuth0 } from "@auth0/auth0-react";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } = useAuth0();

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
    <nav className="bg-[#242424] p-4 lg:p-6">
      <div className="flex justify-between items-center w-full px-4">
        {/* Left: Site name and Categories */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          <Link 
            to="/" 
            className="text-white text-xl lg:text-2xl font-bold whitespace-nowrap overflow-hidden text-ellipsis"
          >
            Auction Site
          </Link>

          {/* Categories Dropdown - Always Visible */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="btn btn-ghost text-gray-200 hover:bg-gray-700 flex items-center whitespace-nowrap overflow-hidden text-ellipsis text-sm lg:text-base"
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

          {/* Search Bar - Visible on screens 750px and above */}
          <div className="hidden md:block">
            <SearchBar />
          </div>
        </div>

        {/* Right: Hamburger Menu for Mobile */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Hamburger Icon for screens 1000px and below */}
          <button
            className="text-white md:block lg:hidden"
            onClick={toggleMenu}
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

          {/* Right-side Links - Visible on screens above 1000px */}
          <div className="hidden lg:flex items-center space-x-4">
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
            {isLoading ? (
              <div>Loading...</div>
            ) : isAuthenticated ? (
              <>
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="bg-[#242424] p-2 space-y-2 md:block lg:hidden">
          {/* Search Bar - Only Visible below 750px */}
          <div className="block md:hidden">
            <SearchBar />
          </div>

          <Link
            to="/auctions"
            className="block text-gray-200 hover:bg-gray-700 py-1 text-sm"
            onClick={() => setMenuOpen(false)}
          >
            Auction List
          </Link>
          <Link
            to="/bids"
            className="block text-gray-200 hover:bg-gray-700 py-1 text-sm"
            onClick={() => setMenuOpen(false)}
          >
            <FaShoppingBasket size={20} />
          </Link>
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout({ returnTo: window.location.origin });
                setMenuOpen(false);
              }}
              className="block text-gray-200 hover:bg-gray-700 py-1 text-sm"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                loginWithRedirect();
                setMenuOpen(false);
              }}
              className="block text-gray-200 hover:bg-gray-700 py-1 text-sm"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
