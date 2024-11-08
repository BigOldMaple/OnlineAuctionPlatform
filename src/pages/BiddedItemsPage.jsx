import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const BiddedItemsPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [biddedItems, setBiddedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchBiddedItems = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/bids/${user.sub}`);
          const data = await response.json();

          // Check if response is successful and if data exists
          if (response.ok && data.length) {
            setBiddedItems(data);
          } else {
            setBiddedItems([]);
          }
        } catch (err) {
          setError("Failed to load bidded items");
        } finally {
          setLoading(false);
        }
      };

      fetchBiddedItems();
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to view your bidded items.</div>;
  }

  if (loading) {
    return <div>Loading your bidded items...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (biddedItems.length === 0) {
    return <div>You have no bidded items yet.</div>;
  }

  return (
    <div>
      <h1>Your Bidded Items</h1>
      <ul>
        {biddedItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default BiddedItemsPage;
