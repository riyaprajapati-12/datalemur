const express = require("express");
const {
  getAllQuestions,
  getQuestionById,
  runQuery
} = require("../controllers/questionController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/questions",authMiddleware, getAllQuestions);
router.get("/question/:id",authMiddleware, getQuestionById);
router.post("/run",authMiddleware, runQuery);

module.exports = router;
