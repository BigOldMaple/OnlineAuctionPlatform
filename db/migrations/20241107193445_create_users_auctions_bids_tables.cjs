// 20241107193445_create_users_auctions_bids_tables.cjs
module.exports.up = function (knex) {
  return knex.schema
    .createTable("users", function (table) {
      table.increments("id").primary();
      table.string("username").notNullable().unique();
      table.string("email").notNullable().unique();
      table.string("password").notNullable();
    })
    .createTable("auctions", function (table) {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.text("description").notNullable();
      table.integer("starting_bid").notNullable();
      table.timestamp("end_time").notNullable();
    })
    .createTable("bids", function (table) {
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
      table.integer("bid_amount").notNullable();
      table.timestamp("bid_time").defaultTo(knex.fn.now());
    });
};

module.exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("bids")
    .dropTableIfExists("auctions")
    .dropTableIfExists("users");
};
