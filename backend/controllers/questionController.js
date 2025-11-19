const path = require("path");
const fs = require("fs");
// const { getDatabase } = require("../config/db");
// const compareResults = require("../utils/compareResults");

let questions;
try {
  const questionsFile = path.join(__dirname, "..", "questions.json");
  if (!fs.existsSync(questionsFile)) {
    console.error("questions.json not found! Exiting.");
    process.exit(1);
  }
  const fileContent = fs.readFileSync(questionsFile, "utf-8");
  questions = JSON.parse(fileContent);
} catch (error) {
  console.error("Failed to load or parse questions.json:", error.message);
  process.exit(1);
}

// ✅ Get all questions
const getAllQuestions = (req, res) => {
  const list = questions.map((q) => ({
    id: q.id,
    title: q.title,
    company_name: q.company_name,
    difficulty: q.difficulty,
    tags: q.tags,
  }));

  res.json(list);
};

// ✅ Get question by ID
const getQuestionById = (req, res) => {
  const q = questions.find((q) => q.id == req.params.id);
  if (!q) {
    return res.status(404).json({ error: "Question not found" });
  }
  res.json(q);
};

// ✅ Run Query (ALL Firebase Removed)
const runQuery = async (req, res) => {
  const { questionId, userQuery } = req.body;

  if (!questionId || !userQuery || typeof userQuery !== "string") {
    return res
      .status(400)
      .json({ error: "questionId and userQuery are required" });
  }

  const q = questions.find((q) => q.id == questionId);
  if (!q) {
    return res.status(404).json({ error: "Question not found" });
  }

  // --- BEGIN Security/Input Check (KEEP THIS) ---
  const forbiddenKeywords = [
    "DROP",
    "DELETE",
    "ALTER",
    "TRUNCATE",
    "UPDATE",
    "INSERT",
    "CREATE",
    "GRANT",
    "REVOKE",
  ];

  const upperCaseUserQuery = userQuery.toUpperCase();
  if (forbiddenKeywords.some((word) => upperCaseUserQuery.includes(word))) {
    return res.status(400).json({
      error: "Destructive or data-modifying queries are not allowed.",
    });
  }
  // --- END Security/Input Check ---
  
  // NOTE: Server no longer runs the query. It just sends the required SQL and configs.
  try {
    // Send the data the frontend needs to run the database instance and queries
    res.json({
      questionId: q.id,
      schema: q.schema, // For creating the database tables
      sampleData: q.sample_data, // For populating the tables
      expectedQuery: q.expected_query, // The solution query for comparison
      rowOrderMatters: q.row_order_matters, // Comparison setting
      columnOrderMatters: q.column_order_matters, // Comparison setting
      // The userQuery is sent back for convenience, though the client already has it
      userQuery: userQuery, 
    });
  } catch (err) {
    // This catch block is mostly for unexpected file/server errors now, not SQL errors
    console.error("Server Error in runQuery:", err);
    res.status(500).json({
      error: "An unexpected server error occurred. Please try again later.",
    });
  }
};

module.exports = { getAllQuestions, getQuestionById, runQuery };