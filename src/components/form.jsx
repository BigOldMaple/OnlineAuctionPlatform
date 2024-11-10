import React, { useState } from "react";
import validator from "validator";
import { toast } from "react-toastify";
import axios from "axios";

// Define the endpoint for user registration
const USER_REGISTRATION_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEVELOPMENT_USER_URL
    : import.meta.env.VITE_PRODUCTION_USER_URL;

// Custom hook for form input handling
const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const [charCount, setCharCount] = useState(null);
  const [isValid, setIsValid] = useState(true);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    setCharCount(inputValue.length > 0 ? inputValue.length : null);

    if (e.target.type === "email") {
      setIsValid(validator.isEmail(inputValue));
    }
  };

  const reset = () => {
    setValue("");
    setCharCount(null);
  };

  return { value, charCount, isValid, handleChange, reset };
};

// User Registration Form Component
const UserRegistrationForm = () => {
  const firstname = useFormInput("");
  const lastname = useFormInput("");
  const email = useFormInput("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      firstname,
      lastname,
      email,
      password,
    };

    try {
      // Make the POST request to register the user
      const response = await axios.post("/api/users/register", userData);
      console.log("User registered successfully:", response.data);
      // Here, you could redirect the user to another page (like login or dashboard) after successful registration.
      toast.success("User registered successfully!");
    } catch (error) {
      console.error(
        "Error registering user:",
        error.response?.data || error.message
      );
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h3>Register New User</h3>
      <form id="user-registration-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstname">First Name:</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={firstname.value}
            onChange={firstname.handleChange}
            required
          />
          {firstname.charCount && <p>{firstname.charCount} characters typed</p>}
        </div>

        <div className="form-group">
          <label htmlFor="lastname">Last Name:</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={lastname.value}
            onChange={lastname.handleChange}
            required
          />
          {lastname.charCount && <p>{lastname.charCount} characters typed</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email.value}
            onChange={email.handleChange}
            required
          />
          {email.value.length > 0 && (
            <p
              className={`email-validation-message ${
                email.isValid ? "" : "invalid"
              }`}
            >
              {email.isValid
                ? "Email valid"
                : "Please enter a valid email address"}
            </p>
          )}
        </div>

        <div className="button-container">
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default UserRegistrationForm;
