

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const questionRoutes = require("./routes/questionRoutes");
const userRoutes = require("./routes/userRoutes");

// --- Firebase Service Account Setup ---
const serviceAccountKeyString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountKeyString) {
  console.error("ERROR: FIREBASE_SERVICE_ACCOUNT_KEY environment variable not set.");
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountKeyString);
} catch (e) {
  console.error("ERROR: Failed to parse service account JSON:", e);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// --- Express App Setup ---
const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "https://datalemur.vercel.app", // your frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// --- Test Route ---
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working fine ✅" });
});

// --- API Routes ---
app.use("/api", questionRoutes);
app.use("/api", userRoutes);

// --- Export for Vercel ---
module.exports = app;

// --- Local Development (only run locally) ---
if (process.env.NODE_ENV !== "production") {
  const PORT = 8081;
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}



