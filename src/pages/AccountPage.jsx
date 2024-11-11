import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import {
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ClockIcon
} from "lucide-react";

function AccountPage() {
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const [bids, setBids] = useState({ ongoing: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'bids', 'settings'

// Update the useEffect in AccountPage where we process the bids
useEffect(() => {
  async function fetchBids() {
    if (!isAuthenticated || !user?.sub) return;

      try {
        setLoading(true);
        setError(null);

      // First get the user's database ID
      const userResponse = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/users/auth0/${user.sub}`
      );
      
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

        const userData = await userResponse.json();
        const userId = userData.data?.id;

      if (!userId) {
        throw new Error('User ID not found');
      }

      // Then fetch the user's bids
      const bidsResponse = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/bids/user/${userId}`
      );

      if (!bidsResponse.ok) {
        throw new Error('Failed to fetch bids');
      }

      const bidsData = await bidsResponse.json();
      
      // Separate bids into ongoing and past
      const ongoing = [];
      const past = [];

      bidsData.data?.forEach(bid => {
        if (bid.status === 'ongoing') {
          ongoing.push(bid);
        } else {
          past.push(bid);
        }
      });

      setBids({
        ongoing: ongoing.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
        past: past.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      });
    } catch (err) {
      console.error('Error fetching bids:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

    fetchBids();
  }, [isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Please log in to view your account
          </h2>
          <p className="text-gray-300 mb-4">
            You need to be logged in to view your account details and bid history.
          </p>
          <button
            onClick={() => loginWithRedirect()}
            className="btn btn-primary"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 transition-colors">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <img
              src={user.picture}
              alt="Profile"
              className="w-24 h-24 rounded-full ring-2 ring-primary"
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white dark:border-gray-800" />
          </div>
          
          <div className="text-center sm:text-left flex-grow">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {user.name || user.nickname}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{user.email}</p>
            <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2">
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Member since {new Date(user.updated_at).getFullYear()}
                </span>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2">
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  Verified {user.email_verified ? '✓' : '✗'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
        <button
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            activeTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            activeTab === 'bids'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('bids')}
        >
          Bid History
        </button>
        <button
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            activeTab === 'settings'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {/* Profile Content */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 transition-colors">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Account Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name
              </label>
              <p className="text-gray-900 dark:text-gray-100">
                {user.given_name || user.nickname?.split(' ')[0] || 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name
              </label>
              <p className="text-gray-900 dark:text-gray-100">
                {user.family_name || user.nickname?.split(' ')[1] || 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <p className="text-gray-900 dark:text-gray-100">
                {user.email}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Account Type
              </label>
              <p className="text-gray-900 dark:text-gray-100">
                {user.sub?.split('|')[0] === 'auth0' ? 'Email' : 'Social Login'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bids Content */}
      {activeTab === 'bids' && (
        <>
          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading your bid history...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-500 rounded-lg p-4 mb-8">
              <p className="text-red-600 dark:text-red-400">Error loading bids: {error}</p>
            </div>
          )}

      {/* Ongoing Bids Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Ongoing Auctions ({bids.ongoing.length})
        </h2>
        {bids.ongoing.length > 0 ? (
          <div className="grid gap-4">
            {bids.ongoing.map((bid) => (
              <BidCard
                key={bid.id}
                bid={bid}
                status="ongoing"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8 bg-gray-800/50 rounded-lg">
            No ongoing bids
          </p>
        )}
      </div>

      {/* Past Bids Section */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Past Auctions ({bids.past.length})
        </h2>
        {bids.past.length > 0 ? (
          <div className="grid gap-4">
            {bids.past.map((bid) => (
              <BidCard
                key={bid.id}
                bid={bid}
                status="past"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8 bg-gray-800/50 rounded-lg">
            No past bids
          </p>
        )}
      </div>
    </div>
  );
}
// BidCard Component
function BidCard({ bid, status }) {
  const isWinning = bid.is_highest_bidder;
  const endTime = new Date(bid.end_time);
  const now = new Date();
  const timeLeft = endTime - now;
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-primary transition-colors">
      <div className="flex justify-between gap-4">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
              {bid.item_name}
            </h3>
            <Link to={`/auction/${bid.item_id}`}>
              <ArrowUpRight className="h-4 w-4 text-primary hover:text-primary/80" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Your Bid:</span>
              <p className="font-medium text-primary">£{Number(bid.bid_amount).toFixed(2)}</p>
            </div>
            <div>
              <span className="text-gray-400">Current Price:</span>
              <p className="font-medium text-emerald-400">£{Number(bid.current_bid).toFixed(2)}</p>
            </div>
            <div>
              <span className="text-gray-400">Bid Date:</span>
              <p className="text-gray-300">{new Date(bid.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              {status === "ongoing" ? (
                <>
                  <span className="text-gray-600 dark:text-gray-400">Time Left:</span>
                  <p className="text-gray-700 dark:text-gray-300">{daysLeft} days</p>
                </>
              ) : (
                <>
                  <span className="text-gray-400">End Date:</span>
                  <p className="text-gray-300">{endTime.toLocaleDateString()}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex flex-col items-center justify-center px-4 border-l border-gray-700">
          {status === 'ongoing' ? (
            isWinning ? (
              <div className="text-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                <span className="text-xs text-emerald-600 dark:text-emerald-400">Winning</span>
              </div>
            ) : (
              <div className="text-center">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400 mx-auto mb-1" />
                <span className="text-xs text-red-600 dark:text-red-400">Outbid</span>
              </div>
            )
          ) : (
            <div className="text-center">
              <ClockIcon className="h-6 w-6 text-gray-500 dark:text-gray-400 mx-auto mb-1" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Ended</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
