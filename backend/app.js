const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require('firebase-admin');
const questionRoutes = require("./routes/questionRoutes");
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const app = express();

app.use(bodyParser.json());
app.use(cors());
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).send({ message: 'No token provided.' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // User ki jaankari request mein jodna
    next(); // Sab theek hai, aage badho
  } catch (error) {
    res.status(401).send({ message: 'Unauthorized. Invalid token.' });
  }
};
// Routes
app.use("/api", questionRoutes);

module.exports = app;
