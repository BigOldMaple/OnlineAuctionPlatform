const bcrypt = require("bcrypt");

exports.seed = async function (knex) {
  await knex("users").del();

  async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  await knex("users").insert([
    {
      firstname: "Andrew",
      lastname: "A",
      email: "andrew@1.com",
      password: await hashPassword("password1"),
    },
    {
      firstname: "Bobby",
      lastname: "B",
      email: "bob@2.com",
      password: await hashPassword("password2"),
    },
    {
      firstname: "Charlie",
      lastname: "C",
      email: "charlie@3.com",
      password: await hashPassword("password3"),
    },
  ]);
};
