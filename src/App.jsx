// App.jsx
import React, { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import Auth0ProviderWithHistory from "./auth0Provider";

// Components
import Navbar from "./Components/Navbar";
import Footer from "./components/Footer";
import AppRouter from "./router";
import ErrorBoundary from "./components/ErrorBoundary";

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-pulse text-gray-600 dark:text-gray-400">Loading...</div>
  </div>
);

// Wrapper component to use theme context
const AppContent = () => {
  const { isDarkMode } = useTheme();
 
  return (
    <ErrorBoundary>
      <Router>
        <Auth0ProviderWithHistory>
          <div className="flex flex-col min-h-screen bg-base-100 transition-colors">
            <Navbar />
           
            <main className="flex-grow w-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Suspense fallback={<LoadingFallback />}>
                  <ErrorBoundary>
                    <AppRouter />
                  </ErrorBoundary>
                </Suspense>
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
        </Auth0ProviderWithHistory>
      </Router>
    </ErrorBoundary>
  );
};

// Main App component
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;