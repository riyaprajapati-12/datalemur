import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import axios from "axios";
import { FaPlay, FaSyncAlt, FaCheck } from "react-icons/fa";

const Playground = ({ questionId, totalQuestions, onSubmission, onReset }) => {
  const [query, setQuery] = useState("-- Write your SQL query here");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  // EDGE CASE: Query validation function to avoid repetition
  const validateQuery = () => {
    // 1. Check for empty or whitespace-only query
    if (!query.trim()) {
      setError("Query cannot be empty. Please write a query to proceed.");
      return false;
    }
    // 2. Check for trailing semicolon
    if (!query.trim().endsWith(";")) {
      setError("Syntax Error: Your SQL query must end with a semicolon (;).");
      return false;
    }
    return true;
  };

  const handleRun = async () => {
    setResult(null);
    setError("");

    // EDGE CASE: Validate query before sending
    if (!validateQuery()) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8081/api/run", {
        questionId,
        userQuery: query,
      });

      // EDGE CASE: Handle successful query with no rows returned
      if (!res.data || !res.data.userResult || res.data.userResult.values.length === 0) {
        setError("Query executed successfully, but returned no results.");
        setResult(null);
      } else {
        setResult({ userResult: res.data.userResult });
      }

    } catch (err) {
      // EDGE CASE: Better error message handling
      const rawError = err.response?.data?.error || "An error occurred.";
      if (rawError.includes("syntax error")) {
        setError("Syntax Error: Please check your SQL syntax.");
      } else if (rawError.includes("does not exist")) {
        setError("Error: A table or column in your query does not exist.");
      } else {
        setError(rawError);
      }
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setResult(null);
    setError("");

    // EDGE CASE: Validate query before sending
    if (!validateQuery()) return;

    setSubmitLoading(true);
    try {
      const res = await axios.post("http://localhost:8081/api/run", {
        questionId,
        userQuery: query,
      });
      onSubmission(res.data);
    } catch (err) {
      // EDGE CASE: Better error message handling
      const rawError = err.response?.data?.error || "An error occurred.";
      if (rawError.includes("syntax error")) {
        setError("Syntax Error: Please check your SQL syntax.");
      } else {
        setError(rawError);
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReset = () => {
    setQuery("-- Write your SQL query here");
    setResult(null);
    setError("");
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="flex flex-col h-full p-6 md:p-8 bg-gray-50 shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">SQL Playground</h2>
      
      <div className="flex-shrink-0 mb-4">
        <CodeMirror
          value={query}
          height="300px"
          extensions={[sql()]}
          onChange={(value) => setQuery(value)}
          theme="light"
          className=" border border-gray-300 shadow-sm"
        />
      </div>

      <div className="flex justify-end gap-4 mb-4 flex-shrink-0">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-full shadow hover:bg-gray-300 transition"
        >
          <FaSyncAlt /> Reset
        </button>
        <button
          onClick={handleRun}
          disabled={loading || submitLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          <FaPlay /> Run
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || submitLoading}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition disabled:bg-gray-400"
        >
          <FaCheck /> Submit
        </button>
      </div>

      <div className="flex-grow overflow-auto p-2 bg-white rounded-lg border border-gray-200 shadow-inner">
        {(loading || submitLoading) && (
          <p className="text-gray-500 animate-pulse">Running query...</p>
        )}
        {error && (
          <div className="text-red-700 font-semibold p-2 bg-red-100 rounded">
            {error}
          </div>
        )}
        {result?.userResult && (
          <div className="overflow-auto max-h-[300px] mt-2">
             <h3 className="font-semibold mb-2 text-gray-700">Your Output:</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  {result.userResult.columns.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {result.userResult.values.map((row, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className="px-4 py-2 text-sm text-gray-900 break-words max-w-[200px]"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && !submitLoading && !error && !result && (
          <p className="text-gray-500 italic">
            Your query results will appear here after clicking 'Run'.
          </p>
        )}
      </div>
    </div>
  );
};

export default Playground;