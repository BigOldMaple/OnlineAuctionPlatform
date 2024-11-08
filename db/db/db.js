import knex from "knex";
import pkg from "../../knexfile.mjs";
const { development, production } = pkg;

const env = process.env.ENVIRONMENT || "development";
const db = env === "development" ? knex(development) : knex(production);

export default db;
