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

const getSubmissions = async (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.user.id; // Auth middleware se milega

    const submissions = await Submission.find({ userId, questionId })
      .sort({ submittedAt: -1 }); // Latest pehle dikhega

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// submissionController.js mein add karein
const getLatestSubmission = async (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.user.id;

    // Latest "Correct" submission nikalne ke liye
    const submission = await Submission.findOne({ userId, questionId, isCorrect: true })
      .sort({ submittedAt: -1 });

    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { saveSubmission, getSubmissions, getLatestSubmission };