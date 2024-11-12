// CategoryLinks.jsx
// This component renders a list of category buttons. When a button is clicked, the user is 
// navigated to the results page for the selected category. Each button has a hover effect 
// and scaling animation to enhance the user experience.
import React from "react";
import { useNavigate } from "react-router-dom";

function CategoryLinks() {
  const navigate = useNavigate();

  const categories = ["Electronics", "Jewelery", "Men's Clothing", "Women's Clothing"];

  const handleCategoryClick = (category) => {
    navigate(`/results?category=${category.toLowerCase()}`);
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center mt-6">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition duration-200 ease-in-out shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryLinks;
