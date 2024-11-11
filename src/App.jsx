// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Slide } from 'react-toastify'; // Add this import
import { Provider } from "react-redux";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import store from "./store";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

// Import ErrorBoundary
import ErrorBoundary from "./components/ErrorBoundary";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRouter from "./Router";

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-pulse text-gray-600 dark:text-gray-400">Loading...</div>
  </div>
);

// Wrapper component to use theme context
const AppContent = () => {
  const { isDarkMode } = useTheme();
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false); // Add this state
 
  useEffect(() => {
    const syncUserWithDatabase = async () => {
      // Only sync if authenticated, have user data, not currently syncing, and haven't completed sync
      if (isAuthenticated && user && !isSyncing && !syncComplete) {
        setIsSyncing(true);
        
        try {
          console.log('Auth0 user data received:', {
            ...user,
            sub: '[REDACTED]'
          });
    
          // Check for email in various possible locations
          const userEmail = user.email || 
                           user.emails?.[0] || 
                           `${user.nickname?.replace(/\s+/g, '.')}@facebook.com`.toLowerCase();
    
          if (!userEmail) {
            throw new Error('No email found in user data');
          }
    
          const userData = {
            auth0_id: user.sub,
            email: userEmail,
            firstname: user.given_name || user.nickname?.split(' ')[0] || user.name?.split(' ')[0] || 'Anonymous',
            lastname: user.family_name || user.name?.split(' ').slice(1).join(' ') || user.nickname?.split(' ').slice(1).join(' ') || 'User'
          };
    
          console.log('Attempting to sync user with data:', {
            ...userData,
            auth0_id: '[REDACTED]'
          });
    
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/users/auth0`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Server response error:', errorData);
            throw new Error(`Server responded with ${response.status}: ${JSON.stringify(errorData)}`);
          }
    
          const responseData = await response.json();
          console.log('User synced successfully:', {
            ...responseData,
            auth0_id: '[REDACTED]'
          });
          
          setSyncComplete(true);
          
          if (!window.localStorage.getItem('userSynced')) {
            toast.success('Welcome! Your account has been synchronized');
            window.localStorage.setItem('userSynced', 'true');
          }
        } catch (error) {
          console.error('User sync error:', error);
          toast.error(`Failed to sync account: ${error.message}`);
          window.localStorage.removeItem('userSynced');
        } finally {
          setIsSyncing(false);
        }
      }
    };

    syncUserWithDatabase();
  }, [isAuthenticated, user]); // Remove isSyncing from dependencies

  // Show loading state only during initial load or first sync
  if (isLoading || (isSyncing && !syncComplete)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-gray-600 dark:text-gray-400">
          {isLoading ? "Authenticating..." : "Syncing your account..."}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-base-100 transition-colors">
      <Navbar />
      
      <main className="flex-grow w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <React.Suspense fallback={<LoadingFallback />}>
            <ErrorBoundary>
              <AppRouter />
            </ErrorBoundary>
          </React.Suspense>
        </div>
      </main>
      <Footer />
      <ToastContainer
        position="bottom-right"
        transition={Slide}
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
        limit={3}
        className="toast-container"
      />
    </div>
  );
};

function App() {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <Provider store={store}>
        <ThemeProvider>
          <Router>
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
          </Router>
        </ThemeProvider>
      </Provider>
    </Auth0Provider>
  );
}

export default App;