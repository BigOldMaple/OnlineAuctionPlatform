module.exports = {
  up: async function (knex) {
    await knex.schema.createTable("auctions", (table) => {
      table.increments("id").primary();
      table
        .integer("item_id")
        .references("id")
        .inTable("items")
        .onDelete("CASCADE");
      table.datetime("start_time").notNullable();
      table.datetime("end_time").notNullable();
      table.decimal("current_bid", 10, 2).defaultTo(0.0);
      table.integer("highest_bid_user").references("id").inTable("users");
      table.timestamps(true, true);
    });
  },

  down: async function (knex) {
    await knex.schema.dropTableIfExists("auctions");
  },
};
