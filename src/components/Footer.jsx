import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

function Footer() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <footer className="bg-base-200 w-full py-6 transition-all duration-200">
      <div className="flex flex-col items-center space-y-4 md:space-y-0 md:flex-row md:items-start md:justify-between max-w-7xl mx-auto px-4 text-center md:text-left">
        {/* Logo and Site Name */}
        <div className="flex items-center space-x-4">
          <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
            AuctionSite
          </div>
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="btn btn-circle btn-sm btn-ghost"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
       
        {/* About Section */}
        <div className="max-w-xs md:max-w-md">
          <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
            About Us
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            AuctionSite is a platform where you can discover unique items and collectibles from around the world. Bid, win, and make great finds!
          </p>
        </div>
       
        {/* Social Media Links */}
        <div className="flex flex-col space-y-2">
          <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Follow Us
          </p>
          <div className="flex space-x-6">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="Facebook"
            >
              <FontAwesomeIcon icon={faFacebook} size="lg" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
              aria-label="Twitter"
            >
              <FontAwesomeIcon icon={faTwitter} size="lg" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
              aria-label="Instagram"
            >
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;