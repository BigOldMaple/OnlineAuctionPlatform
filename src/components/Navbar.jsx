import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaShoppingBasket,
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import SearchBar from "./SearchBar";
import { useAuth0 } from "@auth0/auth0-react";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } =
    useAuth0();

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
        <div className="flex items-center space-x-2 lg:space-x-4">
          <Link
            to="/"
            className="text-white text-xl lg:text-2xl font-bold whitespace-nowrap overflow-hidden text-ellipsis"
          >
            Auction Site
          </Link>

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

          <div className="hidden md:block">
            <SearchBar />
          </div>
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          <button
            className="text-white md:block lg:hidden"
            onClick={toggleMenu}
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

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

            {/* Register Button */}
            {!isAuthenticated && (
              <Link
                to="/register"
                className="btn btn-ghost text-gray-200 hover:bg-gray-700"
              >
                Register
              </Link>
            )}

            {/* Authentication Buttons */}
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
              <>
                <button
                  onClick={loginWithRedirect}
                  className="btn btn-ghost text-gray-200 hover:bg-gray-700"
                >
                  Login with OAuth
                </button>
                <Link
                  to="/login"
                  className="btn btn-ghost text-gray-200 hover:bg-gray-700"
                >
                  Login (DB)
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="bg-[#242424] p-2 space-y-2 md:block lg:hidden">
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
          <Link
            to="/register"
            className="block text-gray-200 hover:bg-gray-700 py-1 text-sm"
            onClick={() => setMenuOpen(false)}
          >
            Register
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
