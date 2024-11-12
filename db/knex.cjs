// db/knex.js
import knex from "knex";
import knexConfig from "../knexfile.cjs";

// Initialize knex with the development configuration
const db = knex(knexConfig.development);

export default db;
