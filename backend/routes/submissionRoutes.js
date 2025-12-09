const express = require("express");
const { saveSubmission } = require("../controllers/submissionController");

const router = express.Router();

router.post("/submit", saveSubmission);

module.exports = router;
