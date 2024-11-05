/**
 * AuctionDetails Component
 * 
 * This component is responsible for displaying detailed information about a specific auction item.
 * It retrieves the auction item's ID from the URL parameters, uses it to fetch the details, and displays them.
 * The component conditionally shows a loading message until the auction details are available.
 * 
 * Props:
 * - None directly, but it uses `auctionId` from the URL via `useParams` from react-router-dom.
 * 
 * Redux State:
 * - auction: The details of the specific auction item, retrieved from the Redux store.
 * 
 * Behavior:
 * - On component mount, the `useEffect` hook is triggered, which (if uncommented) would dispatch
 *   an action to fetch the auction details using the `auctionId` parameter from the URL.
 * - The component displays the auction title, description, and current bid if available.
 * - If the auction details are not yet loaded, a "Loading..." message is displayed.
 * 
 * Usage:
 * This component is designed to be used in a route like `/auction/:id`, where `:id` represents
 * the unique ID of an auction item. Example: <Route path="/auction/:id" element={<AuctionDetails />} />
 * 
 * Note:
 * To enable data fetching, uncomment `dispatch(fetchAuctionDetails(id));` and ensure `fetchAuctionDetails`
 * is properly set up in your Redux slice to retrieve auction details.
 */

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { fetchAuctionDetails } from "../features/auctionSlice"; // Comment or remove this line

function AuctionDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const auction = useSelector((state) => state.auctions.details);

  useEffect(() => {
    // dispatch(fetchAuctionDetails(id)); // Comment out this line as well
  }, [dispatch, id]);

  return (
    <div>
      {auction ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">{auction.title}</h2>
          <p>{auction.description}</p>
          <p>Current Bid: ${auction.currentBid}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default AuctionDetails;
