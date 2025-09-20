const path = require("path");
const fs = require("fs");
const { getDatabase } = require("../config/db");
const compareResults = require("../utils/compareResults");


let questions;
try {
  const questionsFile = path.join(__dirname, "..", "questions.json");
  // EDGE CASE: Check if file exists before reading
  if (!fs.existsSync(questionsFile)) {
    console.error("questions.json not found! Exiting.");
    process.exit(1);
  }
  const fileContent = fs.readFileSync(questionsFile, "utf-8");
  // EDGE CASE: Check if JSON is valid
  questions = JSON.parse(fileContent);
} catch (error) {
  console.error("Failed to load or parse questions.json:", error.message);
  process.exit(1);
}

// Get all questions
const getAllQuestions = (req, res) => {
  const list = questions.map(q => ({
    id: q.id,
    title: q.title,
    company_name: q.company_name,
    difficulty: q.difficulty,
    tags: q.tags
  }));
  res.json(list);
};

// Get question by ID
const getQuestionById = (req, res) => {
  // Using loose equality is fine here since q.id is a number and req.params.id is a string
  const q = questions.find(q => q.id == req.params.id);
  if (!q) {
    return res.status(404).json({ error: "Question not found" });
  }
  res.json(q);
};

// Run user query
const runQuery = async (req, res) => {
  const { questionId, userQuery } = req.body;

  if (!questionId || !userQuery || typeof userQuery !== "string") {
    return res.status(400).json({ error: "questionId and userQuery are required" });
  }

  const q = questions.find(q => q.id == questionId);
  if (!q) {
    return res.status(404).json({ error: "Question not found" });
  }

  
  // SECURITY: Expanded list and case-insensitive check for dangerous queries
  const forbiddenKeywords = ["DROP", "DELETE", "ALTER", "TRUNCATE", "UPDATE", "INSERT", "CREATE", "GRANT", "REVOKE"];
  const upperCaseUserQuery = userQuery.toUpperCase();
  if (forbiddenKeywords.some(word => upperCaseUserQuery.includes(word))) {
    return res.status(400).json({ error: "Destructive or data-modifying queries are not allowed." });
  }

  try {
    const db = await getDatabase(questionId, q.schema, q.sample_data);

    
    // RESOURCE MANAGEMENT: Automatically add a LIMIT to user queries to prevent crashes
    let safeUserQuery = userQuery.trim();
    // Remove trailing semicolon if it exists
    if (safeUserQuery.endsWith(';')) {
      safeUserQuery = safeUserQuery.slice(0, -1);
    }
    // Add LIMIT only if one doesn't already exist
    if (!/LIMIT\s+\d+/i.test(safeUserQuery)) {
      safeUserQuery += " LIMIT 200";
    }
    // Add semicolon back
    safeUserQuery += ';';


    let userRes;
    try {
      // RESOURCE MANAGEMENT (Suggestion): Add a query timeout
      // This depends on your DB driver, e.g., for 'pg' it might look like this:
      // userRes = await db.query({ text: safeUserQuery, query_timeout: 5000 }); // 5 seconds timeout
      userRes = await db.query(safeUserQuery);
    } catch (err) {
     
      // ERROR HANDLING: Log the detailed error for debugging
      console.error("Database Query Error:", err.message);
      // Send a user-friendly error message
      return res.status(400).json({ error: "Invalid SQL query. Please check your syntax." });
    }

    const userResult = {
      columns: userRes.fields?.map(f => f.name) || [],
      values: userRes.rows?.map(r => Object.values(r)) || []
    };

    const expRes = await db.query(q.expected_query);
    const expectedResult = {
      columns: expRes.fields.map(f => f.name),
      values: expRes.rows.map(r => Object.values(r))
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
          : "Try again"
    });
  } catch (err) {
    
    // ERROR HANDLING: Log the full error for debugging
    console.error("Server Error in runQuery:", err);
    // Send a generic error message to the user
    res.status(500).json({ error: "An unexpected server error occurred. Please try again later." });
  }
};

module.exports = { getAllQuestions, getQuestionById, runQuery };