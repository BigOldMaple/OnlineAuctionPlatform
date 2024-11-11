// db/db/migrations/20241111_add_auth0_id_to_users.cjs
exports.up = function(knex) {
    return knex.schema.table('users', table => {
      // Add auth0_id column if it doesn't exist
      return knex.schema.hasColumn('users', 'auth0_id').then(exists => {
        if (!exists) {
          return knex.schema.alterTable('users', table => {
            table.string('auth0_id').unique();
          });
        }
      });
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table('users', table => {
      // Remove the auth0_id column
      return knex.schema.hasColumn('users', 'auth0_id').then(exists => {
        if (exists) {
          return knex.schema.alterTable('users', table => {
            table.dropColumn('auth0_id');
          });
        }
      });
    });
  };