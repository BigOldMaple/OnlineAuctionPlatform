import React, { useState } from "react";
import axios from "axios";

function RegisterForm() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [emailValid, setEmailValid] = useState(false);

  // Function to handle input change and update state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Check email validity in real-time
    if (name === "email") {
      setEmailValid(validateEmail(value));
    }
  };

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5005/api/users",
        formData
      );
      console.log("User created:", response.data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-primary text-center mb-6">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-accent">First Name</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Enter first name"
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                {formData.firstname.length}
              </span>
            </div>
          </div>

          {/* Last Name Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-accent">Last Name</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Enter last name"
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                {formData.lastname.length}
              </span>
            </div>
          </div>

          {/* Email Field with Validation */}
          <div className="form-control">
            <label className="label">
              <span className="label-text text-accent">Email</span>
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Enter email"
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                {formData.email.length}
              </span>
            </div>
            <p className="mt-1 text-sm">
              {formData.email === "" ? (
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
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Enter password"
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                {formData.password.length}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-full mt-4">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
