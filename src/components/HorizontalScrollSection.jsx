
/**
 * HorizontalScrollSection Component
 *
 * A scrollable section for displaying items in a horizontal format with left and right 
 * arrow buttons. Commonly used to showcase auction items in categories like "Featured" 
 * or "Recently Listed."
 *
 * Props:
 * - **title**: Section title displayed at the top.
 * - **items**: Array of items to display, each rendered using the provided `renderCard` function.
 * - **renderCard**: Function to render each item card.
 *
 * Features:
 * - Horizontal scrolling with smooth transitions and button controls.
 */
import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function HorizontalScrollSection({ title, items, renderCard }) {
  const scrollContainer = useRef(null);

  const scrollLeft = () => {
    scrollContainer.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainer.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="max-w-screen-lg mx-auto">
      <h2 className="text-3xl font-bold text-gray-100 mb-6 text-center">{title}</h2>
      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700"
        >
          <FaChevronLeft size={20} />
        </button>
        <div
          ref={scrollContainer}
          className="flex overflow-x-auto space-x-4 scrollbar-hide p-4"
        >
          {items.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-72">
              {renderCard(item)}
            </div>
          ))}
        </div>
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700"
        >
          <FaChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}

export default HorizontalScrollSection;
