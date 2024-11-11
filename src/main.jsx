import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import auctionReducer from "./features/auctionSlice";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { ToastContainer } from "react-toastify";

const store = configureStore({
  reducer: {
    auctions: auctionReducer,
  },
});

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <Provider store={store}>
        <ToastContainer position="top-center" />
        <App />
      </Provider>
    </Auth0Provider>
  </>
);
