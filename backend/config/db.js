const { PGlite } = require("@electric-sql/pglite");

const dbPool = new Map(); // Cache

async function getDatabase(questionId, schemaSQL, sampleSQL) {
  if (!dbPool.has(questionId)) {
    const db = new PGlite();

    // Run schema statements individually
    const schemaStatements = schemaSQL.split(";").filter(s => s.trim());
    for (const stmt of schemaStatements) {
      await db.query(stmt);
    }

    // Run sample data statements individually
    const sampleStatements = sampleSQL.split(";").filter(s => s.trim());
    for (const stmt of sampleStatements) {
      await db.query(stmt);
    }

    dbPool.set(questionId, db);
  }
  return dbPool.get(questionId);
}

module.exports = { getDatabase };

