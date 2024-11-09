import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <footer className="bg-gray-800 w-full text-gray-300 py-6">
      <div className="flex flex-col items-center space-y-4 md:space-y-0 md:flex-row md:items-start md:justify-between max-w-screen-lg mx-auto px-4 text-center md:text-left">
        
        {/* Logo and Site Name */}
        <div className="text-xl font-bold text-white">
          AuctionSite
        </div>
        
        {/* About Section */}
        <div className="max-w-xs md:max-w-md text-gray-400">
          <p>About Us</p>
          <p className="text-sm">
            AuctionSite is a platform where you can discover unique items and collectibles from around the world. Bid, win, and make great finds!
          </p>
        </div>
        
        {/* Social Media Links */}
        <div className="flex space-x-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <FontAwesomeIcon icon={faFacebook} size="lg" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <FontAwesomeIcon icon={faTwitter} size="lg" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <FontAwesomeIcon icon={faInstagram} size="lg" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
