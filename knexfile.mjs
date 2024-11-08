import dotenv from "dotenv";
dotenv.config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config = {
  development: {
    client: "postgresql",
    connection: {
      database: process.env.DEV_DB,
      user: process.env.DEV_USER,
      password: process.env.DEV_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./db/db/migrations",
    },
    seeds: {
      directory: "./db/db/seeds",
    },
  },
  production: {
    client: "postgresql",
    connection: {
      database: process.env.PROD_DB,
      user: process.env.PROD_USER,
      password: process.env.PROD_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./db/migrations",
    },
  },
};

export default config;
