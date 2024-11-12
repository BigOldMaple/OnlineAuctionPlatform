import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  React.useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated, loginWithRedirect]);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-gray-600 dark:text-gray-400">
        Redirecting to login...
      </div>
    </div>
  );
};

export default LoginPage;
