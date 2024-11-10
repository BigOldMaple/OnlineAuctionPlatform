import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

function AccountPage() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  const biddingHistory = [
    { id: 1, itemName: "Vintage Watch", bidAmount: "$120", date: "2024-10-15" },
    { id: 2, itemName: "Electric Guitar", bidAmount: "$300", date: "2024-10-10" },
    // Add more items or fetch this data from an API or state
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to view your account details.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-[#0A0A0A] text-gray-300 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4">Account</h1>

      {/* Profile Section */}
      <div className="flex items-center mb-6">
        <img
          src={user.picture}
          alt="Profile"
          className="w-24 h-24 rounded-full ring-2 ring-blue-400 mr-4"
        />
        <div>
          <h2 className="text-xl font-semibold">{user.name || user.nickname}</h2>
          <p className="text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* Bidding History Section */}
      <div>
        <h2 className="text-2xl font-bold mb-3">Bidding History</h2>
        {biddingHistory.length > 0 ? (
          <div className="space-y-2">
            {biddingHistory.map((bid) => (
              <div
                key={bid.id}
                className="p-3 border border-slate-700 rounded-md flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-lg">{bid.itemName}</h3>
                  <p className="text-sm text-gray-400">Bid Amount: {bid.bidAmount}</p>
                  <p className="text-sm text-gray-400">Date: {bid.date}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No bidding history available.</p>
        )}
      </div>
    </div>
  );
}

export default AccountPage;
