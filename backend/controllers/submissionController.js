const Submission = require("../models/Submission");

const saveSubmission = async (req, res) => {
  const { userId, questionId, userQuery, isCorrect } = req.body;

  const submission = await Submission.create({
    userId,
    questionId,
    userQuery,
    isCorrect,
  });

  res.json(submission);
};

module.exports = { saveSubmission };
