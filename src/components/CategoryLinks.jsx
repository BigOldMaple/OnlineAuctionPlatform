import React from "react";
import { Link } from "react-router-dom";

function CategoryLinks() {
  const categories = ["Men's Clothing", "Women's Clothing", "Jewelery", "Electronics"];

  return (
    <section className="bg-gray-100 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Browse Categories</h2>
      <div className="flex justify-center space-x-8 text-blue-600">
        {categories.map((category) => (
          <Link to={`/categories/${category.toLowerCase()}`} key={category} className="hover:text-blue-800 font-semibold">
            {category}
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategoryLinks;
