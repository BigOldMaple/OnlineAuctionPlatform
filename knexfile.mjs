// knexfile.mjs
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config = {
  development: {
    client: "postgresql",
    connection: {
      host: process.env.DEV_HOST || 'localhost',
      port: process.env.DEV_PORT || 5432,
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
      directory: path.join(__dirname, 'db', 'db', 'migrations'), // Absolute path for migrations
    },
    seeds: {
      directory: path.join(__dirname, 'db', 'db', 'seeds'), // Absolute path for seeds
    },
    debug: true
  },
  production: {
    client: "postgresql",
    connection: {
      host: process.env.PROD_HOST,
      port: process.env.PROD_PORT || 5432,
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
      directory: path.join(__dirname, 'db', 'migrations'),
    },
  },
};

// Log configuration for debugging (without sensitive info)
const debugConfig = {
  development: {
    ...config.development,
    connection: {
      ...config.development.connection,
      password: '[HIDDEN]'
    }
  }
};
console.log('Knex configuration:', debugConfig);

export default config;
