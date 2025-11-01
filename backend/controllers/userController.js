const admin = require("firebase-admin");

// API to create a new user profile
exports.createNewUser = async (req, res) => {
  try {
    // Get secure user data from the middleware
    const { uid, email } = req.user; 
    
    // Get other data from the request body
    const { displayName, provider } = req.body;

    const newUser = {
      uid,
      // This is the fix: If the email from the token is undefined (e.g., from GitHub),
      // save 'null' to the database instead. This prevents the crash.
      email: email || null,
      displayName,
      provider:  provider || "unknown",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // This will now work even if the email is missing
    await admin.firestore().collection("users").doc(uid).set(newUser);

    res.status(201).json({ message: "User profile created successfully!" });
  } catch (error) {
    // Log the detailed error on the backend for debugging
    console.error("Error creating new user profile:", error);
    res.status(500).json({ message: "Something went wrong while creating the user profile." });
  }
};

// API to fetch user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.uid;

    const userDoc = await admin.firestore().collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User profile not found in Firestore." });
    }

    res.status(200).json(userDoc.data());
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Something went wrong while fetching the profile." });
  }
};

