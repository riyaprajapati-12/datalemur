import { useState } from "react";
import HintBox from "./HintBox";

const QuestionPanel = ({ question }) => {
  // Parse all CREATE TABLE statements
  const tables = [];
  if (question.schema) {
    const createStatements = question.schema
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.toUpperCase().startsWith("CREATE TABLE"));
    
    createStatements.forEach((stmt) => {
      const match = stmt.match(/CREATE TABLE (\w+)\s*\(([^)]+)\)/i);
      if (match) {
        const tableName = match[1];
        const columns = match[2].split(",").map((col) => col.trim());
        tables.push({ tableName, columns, rows: [], schema: stmt });
      }
    });
  }

  // Parse sample_data for each table
  if (question.sample_data) {
    const insertStatements = question.sample_data
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.toUpperCase().startsWith("INSERT INTO"));
    
    insertStatements.forEach((stmt) => {
      const match = stmt.match(/INSERT INTO (\w+)\s*VALUES\s*(.+)/i);
      if (match) {
        const tableName = match[1];
        const valuesStr = match[2].trim();
        const rows = valuesStr
          .replace(/^\(/, "")
          .replace(/\);?$/, "")
          .split(/\),\s*\(/)
          .map((row) => row.split(",").map((v) => v.trim().replace(/^'|'$/g, "")));

        const table = tables.find((t) => t.tableName === tableName);
        if (table) table.rows = rows;
      }
    });
  }

  return (
    <div className="p-4 bg-white shadow-lg border border-gray-200 h-full overflow-y-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center md:text-left">
        {question.title}
      </h1>

      <hr className="mb-6 border-gray-300" />

      {/* Question Explanation */}
      <div className="mb-8 p-5 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Question Explanation
        </h2>
        <p className="text-gray-700 text-base leading-relaxed">
          {question.question_text}
        </p>
      </div>

      {/* Render all tables */}
      {tables.map((table, tIdx) => (
        <div key={tIdx} className="mb-8 p-5 bg-gray-50 rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Table: {table.tableName}
          </h2>

          

          {/* Show column list */}
          <ul className="text-gray-700 text-base list-disc list-inside space-y-1 mb-3">
            {table.columns.map((col, idx) => (
              <li key={idx}>
                <span className="font-mono bg-gray-100 text-gray-800 px-2 py-0.5 rounded-md">
                  {col}
                </span>
              </li>
            ))}
          </ul>

          {/* Show sample rows */}
          {table.rows.length > 0 && (
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {table.columns.map((col, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-2 text-left text-sm font-medium text-gray-700 uppercase tracking-wide"
                    >
                      {col.split(" ")[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-gray-50">
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className="px-4 py-2 whitespace-nowrap text-gray-900 text-sm"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}

      {/* Hints */}
      {question.hints && question.hints.length > 0 && (
        <div className="mt-6 p-5 shadow-sm">
          <HintBox hints={question.hints} />
        </div>
      )}
    </div>
  );
};

export default QuestionPanel;
