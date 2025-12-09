const express = require("express");
const User = require("../models/User");
const router = express.Router();

// ✅ Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });
  res.json(user);
});

// ✅ Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json(user);
});

module.exports = router;
