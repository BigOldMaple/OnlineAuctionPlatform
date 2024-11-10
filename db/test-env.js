// db/test-env.js
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '../.env');
console.log('Looking for .env file at:', envPath);

const result = dotenv.config({ path: envPath });
console.log('Dotenv result:', result);

console.log('Environment variables:');
console.log('DEV_DB:', process.env.DEV_DB);
console.log('DEV_USER:', process.env.DEV_USER);
console.log('DEV_HOST:', process.env.DEV_HOST);
console.log('DEV_PORT:', process.env.DEV_PORT);
console.log('DEV_PASSWORD is set:', !!process.env.DEV_PASSWORD);