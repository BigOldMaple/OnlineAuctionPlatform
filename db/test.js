// db/test.js
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '../.env');
console.log('Checking for .env file at:', envPath);
console.log('File exists:', require('fs').existsSync(envPath));

const result = dotenv.config({ path: envPath });
console.log('Dotenv result:', result);
console.log('Environment variables:', {
  DEV_DB: process.env.DEV_DB,
  DEV_USER: process.env.DEV_USER,
  DEV_HOST: process.env.DEV_HOST,
  DEV_PORT: process.env.DEV_PORT,
  hasPassword: !!process.env.DEV_PASSWORD
});