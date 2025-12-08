

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const questionRoutes = require("./routes/questionRoutes");
import pool from './db.js';


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

async function testDb() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ DB connected at', res.rows[0].now);
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1); // optional — dev ke liye helpful
  }
}

await testDb(); 

// ✅ Export for Vercel
module.exports = app;

// ✅ Local Development Server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
