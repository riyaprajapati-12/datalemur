

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const questionRoutes = require("./routes/questionRoutes");

require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const submissionRoutes = require("./routes/submissionRoutes");



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
app.use("/api/auth", authRoutes);
app.use("/api/submission", submissionRoutes);


// ✅ Local Development Server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
  connectDB();
});
