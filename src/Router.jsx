import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuctionListPage from "./pages/AuctionListPage";
import AuctionDetailsPage from "./pages/AuctionDetailsPage";
import BiddedItemsPage from "./pages/BiddedItemsPage";
import ResultsPage from "./pages/ResultsPage";
import AccountPage from "./pages/AccountPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auctions" element={<AuctionListPage />} />
      <Route path="/auction/:id" element={<AuctionDetailsPage />} />
      <Route path="/bids" element={<BiddedItemsPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/account" element={<AccountPage />} />
    </Routes>
  );
}

export default AppRouter;
