const express = require("express");
const {
  getAllQuestions,
  getQuestionById,
  runQuery
} = require("../controllers/questionController");

const router = express.Router();

router.get("/questions", getAllQuestions);
router.get("/question/:id", getQuestionById);
router.post("/run", runQuery);

module.exports = router;
