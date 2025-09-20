const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Yeh function tab chalega jab bhi koi naya user sign up karega
exports.createNewUser = functions.auth.user().onCreate((user) => {
  // User ke object se zaroori jaankari nikalo
  const { uid, email, displayName } = user;

  // Firestore mein save karne ke liye naya user object banao
  // (Yeh hamare schema se match karta hai)
  const newUser = {
    uid: uid,
    email: email,
    displayName: displayName,
    // providerData[0].providerId se pata chalta hai ki 'google.com' se login hua ya 'github.com' se
    provider: user.providerData[0].providerId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(), // Current server time
  };

  // 'users' collection mein user ki 'uid' ko Document ID banakar data save karo
  return admin.firestore().collection("users").doc(uid).set(newUser);
});

