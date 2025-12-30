const express = require("express");
const { saveSubmission, getSubmissions, getLatestSubmission, getSolvedQuestions } = require("../controllers/submissionController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/submit", authMiddleware, saveSubmission);
router.get("/solved", authMiddleware, getSolvedQuestions);
// Naya route:
router.get("/:questionId", authMiddleware, getSubmissions);
router.get("/latest/:questionId", authMiddleware, getLatestSubmission);

module.exports = router;
