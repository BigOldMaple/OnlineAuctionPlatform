// AppRouter.jsx or Router setup file

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuctionListPage from "./pages/AuctionListPage";
import AuctionDetailsPage from "./pages/AuctionDetailsPage"; // Updated import
import BiddedItemsPage from "./pages/BiddedItemsPage";
import ResultsPage from "./pages/ResultsPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auctions" element={<AuctionListPage />} />
      <Route path="/auction/:id" element={<AuctionDetailsPage />} /> {/* Update to use AuctionDetailsPage */}
      <Route path="/bids" element={<BiddedItemsPage/>} /> {/* Add the basket route */}
      <Route path="/results" element={<ResultsPage />} />
    </Routes>
  );
}

export default AppRouter;
