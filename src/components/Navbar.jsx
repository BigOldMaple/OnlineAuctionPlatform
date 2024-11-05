/**
 * Navbar Component
 *
 * A simple navigation bar for the auction site, providing quick access to the homepage,
 * auction list, and login page.
 *
 * Structure:
 * - **Site Logo**: Links to the homepage with the site name, "Auction Site".
 * - **Navigation Links**: Includes links to "Auction List" and "Login".
 */
import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          Auction Site
        </Link>
        
        <div className="space-x-4">
          <Link to="/auctions" className="text-white hover:text-gray-400">
            Auction List
          </Link>
          <Link to="/login" className="text-white hover:text-gray-400">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
