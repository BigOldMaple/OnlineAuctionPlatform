// db/migrations/[timestamp]_create_watchlist.js
exports.up = function(knex) {
    return knex.schema.createTable('watchlist', (table) => {
      table.increments('id').primary();
      table.integer('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable();
      table.integer('item_id')
        .references('id')
        .inTable('items')
        .onDelete('CASCADE')
        .notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      // Add a unique constraint to prevent duplicate watches
      table.unique(['user_id', 'item_id']);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('watchlist');
  };