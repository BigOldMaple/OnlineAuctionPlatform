// app.js
// Main server file for setting up the Express server, middleware, and routes for an auction platform API.
// This includes routes for users, items, auctions, bids, and watchlist management.
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import UsersRouter from "./routes/userRoutes.js";
import ItemsRouter from "./routes/itemsRoutes.js";
import AuctionsRouter from "./routes/auctionRoutes.js";
import BidsRouter from "./routes/bidRoutes.js";
import WatchlistRouter from "./routes/watchlistRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

// CORS and middleware setup
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/api/users", UsersRouter);
app.use("/api/items", ItemsRouter);
app.use("/api/auctions", AuctionsRouter);
app.use("/api/bids", BidsRouter);
app.use("/api/watchlist", WatchlistRouter);

app.get("/getData", (req, res) => {
  const currentTime = new Date().toLocaleString();
  res.json(currentTime);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
