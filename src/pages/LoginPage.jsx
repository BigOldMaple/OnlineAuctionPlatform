
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage({ setUsername }) {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [emailValid, setEmailValid] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "email") {
      setEmailValid(validateEmail(value));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5005/api/login",
        loginData
      );

      console.log("User logged in:", response.data);

      setUsername(response.data.username);
      console.log(data.username);
      navigate("/");
    } catch (error) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-primary text-center mb-6">
          Login
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Database Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {/* Email Field with Validation */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-accent">Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              placeholder="Enter email"
            />
            <p className="mt-1 text-sm">
              {loginData.email === "" ? (
                ""
              ) : emailValid ? (
                <span className="text-green-500">Email Valid</span>
              ) : (
                <span className="text-red-500">Please enter a valid email</span>
              )}
            </p>
          </div>

          {/* Password Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-accent">Password</span>
            </label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              placeholder="Enter password"
            />
          </div>

          {/* Login Button */}
          <button type="submit" className="btn btn-primary w-full mt-4">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

// // pages/LoginPage.jsx
// import React from 'react';
// import { useAuth0 } from '@auth0/auth0-react';
// import { Navigate } from 'react-router-dom';

// const LoginPage = () => {
//   const { isAuthenticated, loginWithRedirect } = useAuth0();

//   React.useEffect(() => {
//     if (!isAuthenticated) {
//       loginWithRedirect();
//     }
//   }, [isAuthenticated, loginWithRedirect]);

//   if (isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="animate-pulse text-gray-600 dark:text-gray-400">
//         Redirecting to login...
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

