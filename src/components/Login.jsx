import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

function Login() {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

  return (
    <div className="text-center">
      {isAuthenticated ? (
        <button
          className="px-4 py-2 bg-red-500 text-white"
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          Logout
        </button>
      ) : (
        <button
          className="px-4 py-2 bg-blue-500 text-white"
          onClick={() => loginWithRedirect()}
        >
          Login
        </button>
      )}
    </div>
  );
}

export default Login;