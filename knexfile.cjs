// knexfile.cjs (inside the root folder)
module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      user: "postgres",
      password: "andrew",
      database: "online_bidding_db",
    },
    migrations: {
      tableName: "knex_migrations", // Default migrations table name
      directory: "./db/migrations", // Path to migrations
    },
    seeds: {
      directory: "./db/seeds", // Adjust to match actual directory
    },
  },
};
