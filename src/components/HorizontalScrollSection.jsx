
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
import { ChevronLeft, ChevronRight } from "lucide-react";

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
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center transition-colors">
        {title}
      </h2>
      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 
            bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 
            rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700
            border border-gray-200 dark:border-gray-700
            transition-all duration-200"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div
          ref={scrollContainer}
          className="flex overflow-x-auto gap-4 scrollbar-hide 
            py-4 px-2 scroll-smooth"
        >
          {items.map((item) => (
            <div key={item.id} className="flex-shrink-0">
              {renderCard(item)}
            </div>
          ))}
        </div>
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3
            bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
            rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700
            border border-gray-200 dark:border-gray-700
            transition-all duration-200"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

export default HorizontalScrollSection;