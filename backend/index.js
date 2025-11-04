

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const questionRoutes = require("./routes/questionRoutes");

// ✅ Firebase Removed → userRoutes bhi hata diya
// const userRoutes = require("./routes/userRoutes");

// ✅ Express App Setup
const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173", 
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

// ✅ Removed userRoutes because Firebase hata diya hai
// app.use("/api", userRoutes);

// ✅ Export for Vercel
module.exports = app;

// ✅ Local Development Server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
