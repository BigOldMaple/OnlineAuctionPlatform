module.exports = {
  up: async function (knex) {
    await knex.schema.createTable("bids", (table) => {
      table.increments("id").primary();
      table
        .integer("auction_id")
        .references("id")
        .inTable("auctions")
        .onDelete("CASCADE");
      table
        .integer("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.decimal("bid_amount", 10, 2).notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  },

  down: async function (knex) {
    await knex.schema.dropTableIfExists("bids");
  },
};
