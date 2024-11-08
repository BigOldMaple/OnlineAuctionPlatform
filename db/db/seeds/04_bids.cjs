exports.seed = async function (knex) {
  await knex("bids").del();

  await knex("bids").insert([
    {
      auction_id: 1,
      user_id: 1,
      bid_amount: 55.0,
      created_at: new Date("2024-11-02T13:00:00"),
    },
    {
      auction_id: 1,
      user_id: 2,
      bid_amount: 60.0,
      created_at: new Date("2024-11-03T15:00:00"),
    },
    {
      auction_id: 2,
      user_id: 3,
      bid_amount: 160.0,
      created_at: new Date("2024-11-04T16:00:00"),
    },
  ]);
};
