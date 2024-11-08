module.exports = {
  up: async function (knex) {
    await knex.schema.createTable("users", (table) => {
      table.increments("id").primary();
      table.string("firstname").notNullable();
      table.string("lastname").notNullable();
      table.string("email").notNullable();
      table.timestamps(true, true);
    });
  },

  down: async function (knex) {
    await knex.schema.dropTableIfExists("users");
  },
};
