import express from "express";
import knex from "../knex.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const auctions = await knex("auctions").select("*");
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch auctions" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const auction = await knex("auctions").where({ id }).first();
    if (!auction) return res.status(404).json({ error: "Auction not found" });
    res.json(auction);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch auction details" });
  }
});

export default router;
