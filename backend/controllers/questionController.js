const path = require("path");
const fs = require("fs");
const { getDatabase } = require("../config/db");
const compareResults = require("../utils/compareResults");

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

  try {
    const db = await getDatabase(questionId, q.schema, q.sample_data);

    let safeUserQuery = userQuery.trim();

    if (safeUserQuery.endsWith(";")) {
      safeUserQuery = safeUserQuery.slice(0, -1);
    }

    if (!/LIMIT\s+\d+/i.test(safeUserQuery)) {
      safeUserQuery += " LIMIT 200";
    }
    safeUserQuery += ";";

    let userRes;
    try {
      userRes = await db.query(safeUserQuery);
    } catch (err) {
      console.error("Database Query Error:", err.message);
      return res
        .status(400)
        .json({ error: "Invalid SQL query. Please check your syntax." });
    }

    const userResult = {
      columns: userRes.fields?.map((f) => f.name) || [],
      values: userRes.rows?.map((r) => Object.values(r)) || [],
    };

    const expRes = await db.query(q.expected_query);

    const expectedResult = {
      columns: expRes.fields.map((f) => f.name),
      values: expRes.rows.map((r) => Object.values(r)),
    };

    const isCorrect = compareResults(
      userResult,
      expectedResult,
      q.row_order_matters,
      q.column_order_matters
    );

    res.json({
      userResult,
      expectedResult,
      isCorrect,
      feedback: isCorrect
        ? "Correct!"
        : userResult.values.length === 0
        ? "No rows returned, check your query"
        : "Try again",
    });
  } catch (err) {
    console.error("Server Error in runQuery:", err);
    res.status(500).json({
      error: "An unexpected server error occurred. Please try again later.",
    });
  }
};

module.exports = { getAllQuestions, getQuestionById, runQuery };
