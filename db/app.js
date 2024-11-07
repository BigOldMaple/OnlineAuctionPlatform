// app.js or server.js
import express from "express";
import cors from "cors";
import pkg from "body-parser";
const { json } = pkg;

import db from "./knex.js"; // Adjust path if necessary

const app = express();

// Middlewares
app.use(cors());
app.use(json());

// Routes
import auctionRoutes from "./routes/auctionRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";

app.use("/api/auctions", auctionRoutes);
app.use("/api/bids", bidRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Online Bidding API");
});

// Set up the server to listen on port 5000
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
