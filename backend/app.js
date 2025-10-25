

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const questionRoutes = require("./routes/questionRoutes");
const serviceAccount = require("./serviceAccountKey.json");
const userRoutes = require("./routes/userRoutes")
// Firebase Admin SDK init
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

app.use(bodyParser.json());
app.use(cors());


// Routes
app.use("/api", questionRoutes);
app.use("/api",userRoutes);
module.exports = app;
