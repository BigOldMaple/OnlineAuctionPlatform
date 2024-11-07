import express from "express";
import knex from "../knex.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { auction_id, user_id, bid_amount } = req.body;

  // Validate bid amount
  if (!auction_id || !user_id || !bid_amount) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [bid] = await knex("bids")
      .insert({
        auction_id,
        user_id,
        bid_amount,
      })
      .returning("*");

    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ error: "Failed to place bid" });
  }
});

export default router;
