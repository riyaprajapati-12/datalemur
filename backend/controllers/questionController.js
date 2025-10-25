const admin = require("firebase-admin"); // 👈 I've added this
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

// Get all questions (no changes here)
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

// Get question by ID (no changes here)
const getQuestionById = (req, res) => {
  const q = questions.find(q => q.id == req.params.id);
  if (!q) {
    return res.status(404).json({ error: "Question not found" });
  }
  res.json(q);
};

// Run user query (UPDATED)
const runQuery = async (req, res) => {
  // 1. Frontend se data nikaalein
  // 'isSubmitting' flag yahaan add kiya gaya hai
  const { questionId, userQuery, isSubmitting } = req.body;

  // 2. Basic validation: Check karein ki zaroori data mila ya nahi
  if (!questionId || !userQuery || typeof userQuery !== "string") {
    return res
      .status(400)
      .json({ error: "questionId and userQuery are required" });
  }

  // 3. Di gayi ID se question dhoondhein
  const q = questions.find((q) => q.id == questionId);
  if (!q) {
    return res.status(404).json({ error: "Question not found" });
  }

  // 4. Security Check: Khatarnaak keywords ko block karein
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
    return res
      .status(400)
      .json({ error: "Destructive or data-modifying queries are not allowed." });
  }

  // 5. Main logic: Database se connect karein aur query run karein
  try {
    // Har query ke liye ek naya, saaf database setup karein
    const db = await getDatabase(questionId, q.schema, q.sample_data);

    // 6. User ki query ko safe banaayein (LIMIT add karna, etc.)
    let safeUserQuery = userQuery.trim();
    if (safeUserQuery.endsWith(";")) {
      safeUserQuery = safeUserQuery.slice(0, -1);
    }
    // Agar user ne LIMIT nahi lagaya hai, toh server crash se bachaane ke liye add karein
    if (!/LIMIT\s+\d+/i.test(safeUserQuery)) {
      safeUserQuery += " LIMIT 200";
    }
    safeUserQuery += ";";

    // 7. User ki query run karein
    let userRes;
    try {
      userRes = await db.query(safeUserQuery);
    } catch (err) {
      // Agar user ki SQL query galat hai (syntax error)
      console.error("Database Query Error:", err.message);
      return res
        .status(400)
        .json({ error: "Invalid SQL query. Please check your syntax." });
    }

    // 8. User ke result ko format karein
    const userResult = {
      columns: userRes.fields?.map((f) => f.name) || [],
      values: userRes.rows?.map((r) => Object.values(r)) || [],
    };

    // 9. Sahi answer (expected query) ko run karein
    const expRes = await db.query(q.expected_query);
    const expectedResult = {
      columns: expRes.fields.map((f) => f.name),
      values: expRes.rows.map((r) => Object.values(r)),
    };

    // 10. Dono results ko compare karein
    const isCorrect = compareResults(
      userResult,
      expectedResult,
      q.row_order_matters,
      q.column_order_matters
    );

    // 11. (IMPORTANT) Conditional Submission Logic
    // Database mein sirf tab save karein jab 'isSubmitting' true ho
    if (isSubmitting) {
      try {
        const submissionData = {
          userId: req.user.uid, // Auth middleware se user ID lein
          problemId: q.id,
          userCode: userQuery, // User ki original query save karein
          status: isCorrect ? "Correct" : "Incorrect", // Boolean ko string mein badlein
          submittedAt: admin.firestore.FieldValue.serverTimestamp(), // Server time
        };

        // Firestore ke 'submission' collection mein data add karein
        await admin.firestore().collection("submission").add(submissionData);
      } catch (dbError) {
        // Agar submission save nahi hota hai, toh error log karein,
        // lekin user ko result dikhaane se na rokein.
        console.error("Failed to save submission:", dbError);
      }
    }

    // 12. Final response frontend ko bhej dein
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
    // 13. Koi bhi server-level error (jaise DB connection fail)
    console.error("Server Error in runQuery:", err);
    res
      .status(500)
      .json({
        error: "An unexpected server error occurred. Please try again later.",
      });
  }
};
module.exports = { getAllQuestions, getQuestionById, runQuery };

