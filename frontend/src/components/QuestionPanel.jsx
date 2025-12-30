import HintBox from "./HintBox";
import { FaCheckCircle } from "react-icons/fa";

const QuestionPanel = ({ question, submissionData, solvedQuestions }) => {
  const isSolved =
    submissionData?.isCorrect || solvedQuestions?.includes(question.id);

  const tables = [];

  /* ------------------ Parse CREATE TABLE ------------------ */
  if (question?.schema) {
    const createStatements = question.schema
      .split(";")
      .map(s => s.trim())
      .filter(s => /^CREATE TABLE/i.test(s));

    createStatements.forEach(stmt => {
      const match = stmt.match(
        /CREATE TABLE\s+(\w+)\s*\(([\s\S]+?)\)/i
      );

      if (!match) return;

      const tableName = match[1];
      const columns = match[2]
        .split(",")
        .map(col => col.trim());

      tables.push({
        tableName,
        columns,
        rows: [],
      });
    });
  }

  /* ------------------ Parse INSERT INTO ------------------ */
  if (question?.sample_data) {
    const insertStatements = question.sample_data
      .split(";")
      .map(s => s.trim())
      .filter(s => /^INSERT INTO/i.test(s));

    insertStatements.forEach(stmt => {
      const match = stmt.match(
        /INSERT INTO\s+(\w+)\s+VALUES\s*(.+)/i
      );

      if (!match) return;

      const tableName = match[1];
      const valuesPart = match[2];

      const rows = valuesPart
        .replace(/^\(/, "")
        .replace(/\)$/, "")
        .split(/\),\s*\(/)
        .map(row =>
          row
            .split(",")
            .map(v => v.trim().replace(/^'|'$/g, ""))
        );

      const table = tables.find(t => t.tableName === tableName);
      if (table) table.rows = rows;
    });
  }

  return (
    <div className="p-4 bg-white border border-gray-200 h-full overflow-y-auto">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-center">
        {question.title}
        {isSolved && (
          <FaCheckCircle className="text-green-500 ml-4" />
        )}
      </h1>

      <hr className="mb-6" />

      {/* Question Text */}
      <div className="mb-8 p-5 bg-gray-50 rounded-xl border">
        <h2 className="text-xl font-semibold mb-3">
          Question Explanation
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {question.question_text}
        </p>
      </div>

      {/* Tables */}
      {tables.map((table, tIdx) => (
        <div
          key={tIdx}
          className="mb-8 p-5 bg-gray-50 rounded-xl border overflow-x-auto"
        >
          <h2 className="text-xl font-semibold mb-3">
            Table: {table.tableName}
          </h2>

          {/* Columns */}
          <ul className="list-disc list-inside mb-4 space-y-1">
            {table.columns.map((col, idx) => (
              <li key={idx}>
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                  {col}
                </span>
              </li>
            ))}
          </ul>

          {/* Sample Rows */}
          {table.rows.length > 0 && (
            <table className="min-w-full border">
              <thead className="bg-gray-100">
                <tr>
                  {table.columns.map((col, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-2 text-left text-sm font-medium"
                    >
                      {col.split(" ")[0]}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y">
                {table.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-gray-50">
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className="px-4 py-2 text-sm"
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
      {question?.hints?.length > 0 && (
        <div className="mt-6">
          <HintBox hints={question.hints} />
        </div>
      )}
    </div>
  );
};

export default QuestionPanel;
