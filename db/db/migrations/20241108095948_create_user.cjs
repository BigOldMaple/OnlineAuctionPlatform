// db/db/migrations/20241108095948_create_user.cjs
exports.up = function(knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("firstname").notNullable();
    table.string("lastname").notNullable();
    table.string("email").notNullable().unique();
    table.string("auth0_id").unique();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users");
};