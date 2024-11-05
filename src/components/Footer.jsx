import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <footer className="bg-gray-800 w-full text-gray-300 py-6">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-screen-lg mx-auto">
        
        <div className="text-xl font-bold text-white mb-4 md:mb-0">
          AuctionSite
        </div>
        
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <p>About Us</p>
          <p className="text-sm text-gray-400 max-w-md">
            AuctionSite is a platform where you can discover unique items and collectibles from around the world. Bid, win, and make great finds!
          </p>
        </div>
        
        <div className="flex space-x-4">
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
