const axios = require("axios");

exports.seed = async function (knex) {
  await knex("items").del();

  try {
    const response = await axios.get("https://fakestoreapi.com/products");
    const products = response.data;

    const items = products.map((product) => ({
      name: product.title,
      description: product.description,
      starting_price: product.price,
      image_url: product.image,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await knex("items").insert(items);
    console.log("Seed data from Fake Store API inserted successfully.");
  } catch (error) {
    console.error("Error fetching data from Fake Store API:", error);
  }
};
