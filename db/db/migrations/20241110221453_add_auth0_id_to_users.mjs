exports.up = function(knex) {
    return knex.schema
      .dropTableIfExists('users')
      .then(() => {
        return knex.schema.createTable('users', table => {
          table.increments('id').primary();
          table.string('firstname').notNullable();
          table.string('lastname').notNullable();
          table.string('email').notNullable();
          table.string('auth0_id').unique();
          table.timestamps(true, true);
        });
      });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('users');
  };
  