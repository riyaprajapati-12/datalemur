// middleware/authMiddleware.js

const authMiddleware = (req, res, next) => {
  // Firebase removed → authentication disabled
  next();
};

module.exports = authMiddleware;
