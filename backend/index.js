

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const questionRoutes = require("./routes/questionRoutes");
import pool from './config/db';


// ✅ Express App Setup
const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "https://datalemur.onrender.com", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Test Route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working fine ✅" });
});

// ✅ API Routes
app.use("/api", questionRoutes);

app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Export for Vercel
module.exports = app;

// ✅ Local Development Server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
