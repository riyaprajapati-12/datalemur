

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
  // आप यहां app को crash होने से रोकने के लिए कुछ और लॉजिक भी डाल सकते हैं
}

// 2. JSON string को JavaScript Object में parse करें
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
  // अगर आप Realtime Database का उपयोग कर रहे हैं, तो databaseURL भी जोड़ें
  // databaseURL: "https://YOUR-PROJECT-ID.firebaseio.com" 
});

// --- बदलाव यहाँ खत्म ---

const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: 'https://datalemur-i9y5.vercel.app', // अपना Vercel URL यहाँ डालें
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // यदि आप Cookies या Authorization Headers भेज रहे हैं
}));


// Routes
app.use("/api", questionRoutes);
app.use("/api", userRoutes);

// Vercel deployment के लिए module.exports जरूरी है
module.exports = app;