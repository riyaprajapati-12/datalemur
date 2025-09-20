// // Import required modules
// const express = require("express");        // Express framework for creating APIs
// const bodyParser = require("body-parser"); // To parse JSON request bodies
// const fs = require("fs");                  // For reading files (demo.json)
// const path = require("path");              // To handle file paths
// const { PGlite } = require("@electric-sql/pglite"); // Lightweight embedded SQL DB
// const cors = require("cors");              // To allow frontend (React) to call backend APIs

// const app = express(); // Create express app
// app.use(bodyParser.json()); // Enable JSON parsing in requests
// app.use(cors()); // Enable CORS (frontend-backend communication)

// // ---------------- Load Questions ----------------
// const questionsFile = path.join(__dirname, "demo.json"); // Path to demo.json
// if (!fs.existsSync(questionsFile)) {
//   console.error("demo.json not found!"); // If file is missing, stop server
//   process.exit(1);
// }
// const questions = JSON.parse(fs.readFileSync(questionsFile, "utf-8")); // Load all questions from demo.json

// // ---------------- In-memory DB Pool ----------------
// const dbPool = new Map(); // Cache for databases (one DB per question)

// // Function to create or fetch a database for a specific question
// async function getDatabase(questionId, schemaSQL, sampleSQL) {
//   if (!dbPool.has(questionId)) {          // If DB not created yet for this question
//     const db = new PGlite();              // Create new in-memory DB
//     await db.query(schemaSQL);            // Load schema (tables, columns, etc.)
//     await db.query(sampleSQL);            // Insert sample data
//     dbPool.set(questionId, db);           // Store DB in cache
//   }
//   return dbPool.get(questionId);          // Return the DB for this question
// }

// // ---------------- Compare Results Function ----------------
// function compareResults(userResult, expectedResult, rowOrder, colOrder) {
//   let u = userResult.values;
//   let e = expectedResult.values;

//   // If row order doesn't matter → sort rows
//   if (!rowOrder) {
//     u = u.map(r => JSON.stringify(r)).sort();
//     e = e.map(r => JSON.stringify(r)).sort();
//   }

//   // If column order doesn't matter → sort columns
//   if (!colOrder) {
//     u = u.map(r => [...r].sort());
//     e = e.map(r => [...r].sort());
//   }

//   // Final comparison → check if user result == expected result
//   return JSON.stringify(u) === JSON.stringify(e);
// }

// // ---------------- API Endpoints ----------------

// // 1. Get list of all questions
// app.get("/questions", (req, res) => {
//   const list = questions.map(q => ({
//     id: q.id,
//     title: q.title,
//     company_name: q.company_name,
//     difficulty: q.difficulty,
//     tags: q.tags
//   }));
//   res.json(list); // Send question list to frontend
// });

// // 2. Get question by ID
// app.get("/question/:id", (req, res) => {
//   const q = questions.find(q => q.id == req.params.id); // Find question
//   if (!q) return res.status(404).json({ error: "Question not found" }); // If not found
//   res.json(q); // Return question data
// });

// // 3. Run user query and compare with expected
// app.post("/run", async (req, res) => {
//   const { questionId, userQuery } = req.body; // Extract data from frontend request
//   const q = questions.find(q => q.id == questionId); // Find question by ID
//   if (!q) return res.status(404).json({ error: "Question not found" });

//   try {
//     const db = await getDatabase(questionId, q.schema, q.sample_data); // Get DB for this question

//     // Run user query
//     const userRes = await db.query(userQuery);
//     const userResult = {
//       columns: userRes.fields.map(f => f.name),         // Column names
//       values: userRes.rows.map(r => Object.values(r))   // Row values
//     };

//     // Run expected query (correct answer)
//     const expRes = await db.query(q.expected_query);
//     const expectedResult = {
//       columns: expRes.fields.map(f => f.name),
//       values: expRes.rows.map(r => Object.values(r))
//     };

//     // Compare user query vs expected query results
//     const isCorrect = compareResults(
//       userResult,
//       expectedResult,
//       q.row_order_matters,
//       q.column_order_matters
//     );

//     // Send response to frontend
//     res.json({
//       userResult,
//       expectedResult,
//       isCorrect,
//       feedback: isCorrect ? "Correct!" : "Try again"
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message }); // Handle errors (syntax error etc.)
//   }
// });

// // ---------------- Start Server ----------------
// app.listen(8081, () => {
//   console.log("Backend running on http://localhost:8081");
// });


const app = require("./app");

const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
