const express = require("express");
const { saveSubmission } = require("../controllers/submissionController");
const authMiddleware = require("../middleware/authMiddleware"); // Import karein

const router = express.Router();

// Middleware add kar diya taki sirf logged in users submit kar sakein
router.post("/submit", authMiddleware, saveSubmission);

module.exports = router;
