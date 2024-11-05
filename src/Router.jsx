
import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuctionListPage from "./pages/AuctionListPage";
import AuctionDetails from "./components/AuctionDetails";
import Login from "./components/Login";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auctions" element={<AuctionListPage />} />
      <Route path="/auction/:id" element={<AuctionDetails />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default AppRouter;
