exports.seed = async function (knex) {
  await knex("users").del();

  await knex("users").insert([
    { firstname: "Andrew", lastname: "L", email: "andrew@1.com" },
    { firstname: "Bobby", lastname: "B", email: "bob@2.com" },
    { firstname: "Charlie", lastname: "C", email: "charlie@3.com" },
  ]);
};
