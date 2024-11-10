import express from "express";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const existingUser = await db("users").where({ email }).first();
  if (existingUser) {
    return res.status(400).json({ message: "Email is already registered" });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Insert new user into the database
  try {
    const [newUser] = await db("users")
      .insert({
        firstname,
        lastname,
        email,
        password: hashedPassword,
      })
      .returning("*");

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: newUser.id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
});

export default router;
