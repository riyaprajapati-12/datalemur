// middleware/authMiddleware.js

const admin = require('firebase-admin');

const authMiddleware = async (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided. Unauthorized.' });
  }

  try {
    // Verify the token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    // Attach user information to the request object
    req.user = decodedToken; 
    next(); // Token is valid, proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).json({ error: 'Invalid or expired token. Forbidden.' });
  }
};

module.exports = authMiddleware;