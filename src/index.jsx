import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store"; // Import your Redux store
import App from "./App"; // Main App component

const root = ReactDOM.createRoot(document.getElementById("root")); // Ensure this matches the element ID in index.html
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
