// db/db/db.js
import knex from "knex";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct path to .env file (two levels up from db/db/db.js)
const envPath = path.join(__dirname, '../../.env');
console.log('Looking for .env file at:', envPath);

// Load environment variables
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error('Error loading .env file:', result.error);
  process.exit(1); // Exit if we can't load environment variables
}

// Debug environment variables
console.log('Environment variables after loading:', {
  DEV_DB: process.env.DEV_DB,
  DEV_USER: process.env.DEV_USER,
  DEV_HOST: process.env.DEV_HOST,
  DEV_PORT: process.env.DEV_PORT
});

const dbConfig = {
  client: 'postgresql',
  connection: {
    host: process.env.DEV_HOST || 'localhost',
    port: parseInt(process.env.DEV_PORT || '5432'),
    database: process.env.DEV_DB,
    user: process.env.DEV_USER,
    password: process.env.DEV_PASSWORD
  },
  pool: { min: 2, max: 10 }
};

const db = knex(dbConfig);

// Test connection
db.raw('SELECT 1')
  .then(() => {
    console.log('Database connected successfully!');
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

export default db;