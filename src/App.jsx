// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { ToastContainer, toast, Slide } from "react-toastify";
import { Provider } from "react-redux";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react"; // Add Auth0Provider here
import store from "./store";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRouter from "./Router";
import ErrorBoundary from "./components/ErrorBoundary";


// function App() {
//   return (
//     <Router>
//       <div className="flex flex-col min-h-screen">
//         <Navbar />
//         <main className="flex-grow max-w-screen-lg mx-auto p-4">
//           <AppRouter />
//           <ToastContainer />
//         </main>

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-pulse text-gray-600 dark:text-gray-400">Loading...</div>
  </div>
);

// Wrapper component to use theme context
const AppContent = () => {
  const { isDarkMode } = useTheme();
  const { user, isAuthenticated } = useAuth0();
 
  useEffect(() => {
    const syncUserWithDatabase = async () => {
      if (isAuthenticated && user) {
        try {
          console.log('Attempting to sync user:', {
            auth0_id: user.sub,
            email: user.email,
            firstname: user.given_name || user.nickname || user.name?.split(' ')[0] || 'Anonymous',
            lastname: user.family_name || user.name?.split(' ').slice(1).join(' ') || 'User'
          });
  
          const response = await fetch('http://localhost:5005/api/users/auth0', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              auth0_id: user.sub,
              email: user.email,
              firstname: user.given_name || user.nickname || user.name?.split(' ')[0] || 'Anonymous',
              lastname: user.family_name || user.name?.split(' ').slice(1).join(' ') || 'User'
            }),
          });
  
          const data = await response.text(); // Get raw response text
          console.log('Raw response:', data);
          
          if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${data}`);
          }
  
          const userData = JSON.parse(data);
          console.log('User synced successfully:', userData);
          toast.success('Successfully synced user data');
        } catch (error) {
          console.error('Detailed sync error:', error);
          toast.error(`Failed to sync user data: ${error.message}`);
        }
      }
    };
  
    syncUserWithDatabase();
  }, [isAuthenticated, user]);
  


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