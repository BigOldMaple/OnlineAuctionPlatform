import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App"; 

const root = ReactDOM.createRoot(document.getElementById("root")); // Ensure this matches the element ID in index.html
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
