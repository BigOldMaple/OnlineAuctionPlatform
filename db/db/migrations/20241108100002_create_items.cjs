module.exports = {
  up: async function (knex) {
    await knex.schema.createTable("items", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.text("description");
      table.decimal("starting_price", 10, 2).notNullable();
      table.string("image_url");
      table.timestamps(true, true);
    });
  },

  down: async function (knex) {
    await knex.schema.dropTableIfExists("items");
  },
};
