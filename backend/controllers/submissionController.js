const Submission = require("../models/Submission");

const saveSubmission = async (req, res) => {
  try {
    const { questionId, userQuery, isCorrect } = req.body;

    const submission = await Submission.create({
      userId: req.user.id,   // ✅ token se
      questionId,
      userQuery,
      isCorrect,
    });

    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { saveSubmission };

