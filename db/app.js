import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import UsersRouter from "./routes/userRoutes.js";
import ItemsRouter from "./routes/itemsRoutes.js";
import AuctionsRouter from "./routes/auctionRoutes.js";
import BidsRouter from "./routes/bidRoutes.js";
import loginRouter from "./routes/loginRoute.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

app.use("/api/users", UsersRouter);
app.use("/api/items", ItemsRouter);
app.use("/api/auctions", AuctionsRouter);
app.use("/api/bids", BidsRouter);
app.use(loginRouter);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use((req, res) => {
  res.status(400).send("Bad Request. route not found");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
