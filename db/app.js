import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import UsersRouter from "./routes/userRoutes.js";
import ItemsRouter from "./routes/itemsRoutes.js";
import AuctionsRouter from "./routes/auctionRoutes.js";
import BidsRouter from "./routes/bidRoutes.js";

import loginRouter from "./routes/loginRoute.js";

import db from "./db/db.js"; // Import the database connection

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

// Debug database schema
db.raw(`
  SELECT column_name, data_type 
  FROM information_schema.columns 
  WHERE table_name = 'users';
`).then(result => {
  console.log('Current users table schema:', result.rows);
}).catch(err => {
  console.error('Error checking schema:', err);
});

// CORS configuration to allow requests from your frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Update with your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// API Routes
app.use("/api/users", UsersRouter);
app.use("/api/items", ItemsRouter);
app.use("/api/auctions", AuctionsRouter);
app.use("/api/bids", BidsRouter);
app.use(loginRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
