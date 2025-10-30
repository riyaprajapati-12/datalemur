

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const questionRoutes = require("./routes/questionRoutes");
const userRoutes = require("./routes/userRoutes"); // यह लाइन सही है

// --- यहाँ बदलाव करें ---

// 1. Environment variable से key string प्राप्त करें
const serviceAccountKeyString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountKeyString) {
  console.error('ERROR: FIREBASE_SERVICE_ACCOUNT_KEY environment variable not set.');
  
}


let serviceAccount;
try {
    serviceAccount = JSON.parse(serviceAccountKeyString);
} catch (e) {
    console.error('ERROR: Failed to parse service account JSON:', e);
    // Handle error if the JSON string is invalid
}


// Firebase Admin SDK init
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
 
});

// --- बदलाव यहाँ खत्म ---

const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: 'https://datalemur.vercel.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true 
}));

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working fine ✅" });
});


// Routes
app.use("/api", questionRoutes);
app.use("/api", userRoutes);

module.exports = app;