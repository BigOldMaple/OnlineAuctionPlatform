import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { Star } from "lucide-react";

function AuctionCard({ item }) {
  const { isDarkMode } = useTheme();

  return (
    <Link
      to={`/auction/${item.id}`}
      className="w-72 h-96 p-4 rounded-lg shadow-lg flex flex-col
        transform transition-all duration-200
        hover:scale-105 
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        hover:shadow-xl hover:bg-gray-50 dark:hover:bg-gray-700"
    >
      {/* Image Container */}
      <div className="h-48 flex justify-center items-center mb-4 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-900">
        <img
          src={item.image}
          alt={item.title}
          className="object-contain h-full w-full"
        />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 truncate">
        {item.title}
      </h3>

      {/* Description */}
      <p
        className="text-gray-600 dark:text-gray-300 mt-2 overflow-hidden text-sm"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical"
        }}
      >
        {item.description}
      </p>

      {/* Details Section */}
      <div className="mt-auto space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Price:</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            £{item.price}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Category:</span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {item.category}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Rating:</span>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-amber-500 fill-current" />
            <span className="text-amber-500">
              {item.rating.rate}
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                ({item.rating.count})
              </span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default AuctionCard;