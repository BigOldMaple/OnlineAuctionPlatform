/**
 * AccountPage Component
 * 
 * A comprehensive user account management page with tabbed interface for profile, bid history, and settings.
 * 
 * Features:
 * - Profile information display
 * - Bid history tracking (ongoing and past bids)
 * - Account settings management
 * - Dark/light mode support
 * - Responsive design
 * 
 * Dependencies:
 * - Auth0: User authentication and profile data
 * - API Integration: User and bid data endpoints
 * - BidCard: Sub-component for bid display
 * 
 * Data Flow:
 * 1. Authenticates user through Auth0
 * 2. Fetches user data from database
 * 3. Retrieves bid history
 * 4. Manages tab state for different sections
 * 
 * State Management:
 * - Local state for tabs, loading, and errors
 * - Auth0 context for user data
 * - Bid history data with sorting
 */

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
  // Auth0 hooks
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  
  // Local state management
  const [bids, setBids] = useState({ ongoing: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  // Fetch bid history data
  useEffect(() => {
    async function fetchBids() {
      if (!isAuthenticated || !user?.sub) return;

      try {
        setLoading(true);
        setError(null);

        // Phase 1: Get user's database ID
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

        // Phase 2: Fetch user's bids
        const bidsResponse = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/bids/user/${userId}`
        );

        if (!bidsResponse.ok) {
          throw new Error('Failed to fetch bids');
        }

        const bidsData = await bidsResponse.json();
        
        // Phase 3: Sort bids into ongoing and past
        const ongoing = [];
        const past = [];

        bidsData.data?.forEach(bid => {
          if (bid.status === 'ongoing') {
            ongoing.push(bid);
          } else {
            past.push(bid);
          }
        });

        // Sort bids by date (newest first)
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

  // Authentication loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Please log in to view your account
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
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

          {/* Ongoing Bids */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Ongoing Auctions ({bids.ongoing.length})
            </h2>
            {bids.ongoing.length > 0 ? (
              <div className="grid gap-4">
                {bids.ongoing.map((bid) => (
                  <BidCard key={bid.id} bid={bid} status="ongoing" />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                No ongoing bids
              </p>
            )}
          </div>

          {/* Past Bids */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Past Auctions ({bids.past.length})
            </h2>
            {bids.past.length > 0 ? (
              <div className="grid gap-4">
                {bids.past.map((bid) => (
                  <BidCard key={bid.id} bid={bid} status="past" />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                No past bids
              </p>
            )}
          </div>
        </>
      )}

      {/* Settings Content */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Account Settings
          </h2>
          <div className="space-y-4">
            {/* Email Preferences */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="text-gray-900 dark:text-gray-100 font-medium">
                  Email Notifications
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Receive email updates about your auctions and bids
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
              </label>
            </div>

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="text-gray-900 dark:text-gray-100 font-medium">
                  Two-Factor Authentication
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Enable
              </button>
            </div>

            {/* Delete Account */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h3 className="text-gray-900 dark:text-gray-100 font-medium">
                  Delete Account
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Permanently remove your account and data
                </p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
/**
 * BidCard Component
 * 
 * Displays individual bid information with status indicators and formatting.
 * 
 * Props:
 * - bid: Bid data object
 * - status: 'ongoing' | 'past'
 * 
 * Features:
 * - Price formatting
 * - Time remaining calculation
 * - Status indicators (winning, outbid, ended)
 * - Link to auction
 * - Responsive layout
 */

function BidCard({ bid, status }) {
  // Bid status calculations
  const isWinning = bid.is_highest_bidder;
  const endTime = new Date(bid.end_time);
  const now = new Date();
  const timeLeft = endTime - now;
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700 hover:border-primary transition-colors">
      <div className="flex justify-between gap-4">
        {/* Bid information section */}
        <div className="flex-grow">
          {/* Title and link */}
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
              {bid.item_name}
            </h3>
            <Link to={`/auction/${bid.item_id}`}>
              <ArrowUpRight className="h-4 w-4 text-primary hover:text-primary/80" />
            </Link>
          </div>
          
          {/* Bid details grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {/* Bid amount */}
            <div>
              <span className="text-gray-600 dark:text-gray-400">Your Bid:</span>
              <p className="font-medium text-primary">
                £{Number(bid.bid_amount).toFixed(2)}
              </p>
            </div>
            
            {/* Current price */}
            <div>
              <span className="text-gray-600 dark:text-gray-400">Current Price:</span>
              <p className="font-medium text-emerald-600 dark:text-emerald-400">
                £{Number(bid.current_bid).toFixed(2)}
              </p>
            </div>
            
            {/* Bid date */}
            <div>
              <span className="text-gray-600 dark:text-gray-400">Bid Date:</span>
              <p className="text-gray-700 dark:text-gray-300">
                {new Date(bid.created_at).toLocaleDateString()}
              </p>
            </div>
            
            {/* Time information */}
            <div>
              {status === 'ongoing' ? (
                <>
                  <span className="text-gray-600 dark:text-gray-400">Time Left:</span>
                  <p className="text-gray-700 dark:text-gray-300">{daysLeft} days</p>
                </>
              ) : (
                <>
                  <span className="text-gray-600 dark:text-gray-400">End Date:</span>
                  <p className="text-gray-700 dark:text-gray-300">
                    {endTime.toLocaleDateString()}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Status indicator section */}
        <div className="flex flex-col items-center justify-center px-4 border-l border-gray-200 dark:border-gray-700">
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