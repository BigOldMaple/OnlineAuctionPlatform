/**
 * HomePage Component
 *
 * This component serves as the main landing page for the auction site. It provides:
 * - A welcome message and introductory buttons to access the Auction List or start bidding.
 * - A detailed guide on using the website, including steps on how to browse items, view details,
 *   place bids, and create an account.
 * - Helpful tips to improve the user experience, like setting maximum bids and tracking auctions.
 *
 * Links:
 * - "Auction List" and "Start Bidding" buttons navigate to the AuctionListPage.
 * - Links are styled for easy navigation, with the guide section designed to be visually distinct.
 */
import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { ShoppingBag, Clock, User, Star, ArrowRight } from "lucide-react";

function HomePage() {

//   return (
//     <div className="container mx-auto p-6 text-center">
//       <h1 className="text-4xl font-bold mb-6">Welcome to the Auction Site</h1>
//       <p className="text-lg mb-8">
//         Find the best items to bid on and start bidding today!
//       </p>

  const { isDarkMode } = useTheme();


  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Welcome to AuctionSite
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-600 dark:text-gray-300">
          Find the best items to bid on and start your auction journey today!
        </p>
        <Link 
          to="/auctions"
          className="inline-flex items-center gap-2 btn btn-primary btn-lg"
        >
          Start Bidding
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      {/* User Guide Section */}

//       <section className="text-left bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
//         <h2 className="text-2xl font-bold mb-4">How to Use Our Auction Site</h2>

//         <p className="mb-4">
//           Our auction site offers an easy and enjoyable way to bid on your
//           favorite items. Follow the steps below to get started:
//         </p>

//         <ol className="list-decimal list-inside mb-4 space-y-2">
//           <li>
//             <strong>Browse Auctions:</strong> Visit the{" "}
//             <Link to="/auctions" className="text-blue-400 hover:underline">
//               Auction List
//             </Link>{" "}
//             page to view all available items. Each item card displays essential
//             information, like the title, description, and current bid.
//           </li>
//           <li>
//             <strong>View Item Details:</strong> Click on an item to see more
//             details, including the full description, category, and rating. From
//             here, you can decide if you want to place a bid.
//           </li>
//           <li>
//             <strong>Place a Bid:</strong> To participate in an auction, enter
//             your bid amount and confirm.
//           </li>
//           <li>
//             <strong>Create an Account:</strong> Log in or sign up to track your
//             bidding history and receive updates on your items.
//           </li>
//         </ol>

//         <h3 className="text-xl font-semibold mt-6">Helpful Tips</h3>
//         <ul className="list-disc list-inside space-y-2">
//           <li>Set a maximum bid amount to avoid overbidding.</li>
//           <li>
//             Monitor the countdown timer on each auction to know when bidding
//             ends.
//           </li>
//           <li>Check your account for updates on your bid status.</li>
//         </ul>

      <section className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 transition-colors duration-200">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            How to Use Our Auction Site
          </h2>
          
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Our auction site offers an easy and enjoyable way to bid on your favorite items.
            Follow these steps to get started:
          </p>

          {/* Steps Section */}
          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
                  Browse Auctions
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Visit the{" "}
                  <Link to="/auctions" className="text-primary hover:underline">
                    Auction List
                  </Link>
                  {" "}page to view all available items. Each item card displays essential information.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
                  View Item Details
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Click on an item to see more details, including the full description, category, and rating.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
                  Place a Bid
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  To participate in an auction, enter your bid amount and confirm your bid.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
                  Create an Account
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Log in or sign up to track your bidding history and receive updates on your items.
                </p>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Helpful Tips
            </h3>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                Set a maximum bid amount to avoid overbidding
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                Monitor the countdown timer on each auction
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                Check your account for updates on your bid status
              </li>
            </ul>
          </div>
        </div>

      </section>
    </div>
  );
}

export default HomePage;
