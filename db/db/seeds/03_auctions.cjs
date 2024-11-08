exports.seed = async function (knex) {
  await knex("auctions").del();

  // Inserts seed entries
  await knex("auctions").insert([
    {
      item_id: 1,
      start_time: new Date("2024-11-01T12:00:00"),
      end_time: new Date("2024-11-10T12:00:00"),
      current_bid: 50.0,
      highest_bid_user: null,
    },
    {
      item_id: 2,
      start_time: new Date("2024-11-02T12:00:00"),
      end_time: new Date("2024-11-12T12:00:00"),
      current_bid: 150.0,
      highest_bid_user: null,
    },
    {
      item_id: 3,
      start_time: new Date("2024-11-03T12:00:00"),
      end_time: new Date("2024-11-13T12:00:00"),
      current_bid: 300.0,
      highest_bid_user: null,
    },
  ]);
};
