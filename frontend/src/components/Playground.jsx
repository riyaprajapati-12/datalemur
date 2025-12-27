import { useState , useEffect} from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { EditorView } from "@codemirror/view";
import axios from "axios";
import { FaPlay, FaSyncAlt, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// 💡 NEW IMPORTS for Client-Side DB Execution
import { PGlite } from "@electric-sql/pglite";
import compareResults from "../utils/compareResults"

// Global PGlite instance for the current question's session
let db = null;
let currentQuestionId = null;

// Utility function to initialize the PGlite database
const initializeDB = async (questionId, schema, sampleData) => {
    if (db === null || currentQuestionId !== questionId) {
        db = new PGlite();
        currentQuestionId = questionId;

        const schemaStatements = schema.split(";").filter(s => s.trim());
        for (const stmt of schemaStatements) {
            await db.query(stmt);
        }

        const sampleStatements = sampleData.split(";").filter(s => s.trim());
        for (const stmt of sampleStatements) {
            await db.query(stmt);
        }
    }
    return db;
};

const Playground = ({ questionId, onSubmission, onReset , initialQuery}) => {
  const [query, setQuery] = useState("-- Write your SQL query here");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateQuery = () => {
    if (!query.trim()) {
      setError("Query cannot be empty. Please write a query to proceed.");
      return false;
    }
    return true;
  };

  const fetchQuestionSetup = async () => {
    return axios.post(
      "https://datalemur-1.onrender.com/api/run",
      { questionId, userQuery: query }
    );
  };

  const executeClientQuery = async (isSubmitting = false) => {
    setLoading(true);
    setSubmitLoading(isSubmitting);
    try {
      const setupRes = await fetchQuestionSetup();
      const setupData = setupRes.data;

      const dbInstance = await initializeDB(
        questionId,
        setupData.schema,
        setupData.sampleData
      );

      let safeUserQuery = query.trim();
      if (safeUserQuery.endsWith(";")) safeUserQuery = safeUserQuery.slice(0, -1);
      if (!isSubmitting && !/LIMIT\s+\d+/i.test(safeUserQuery)) {
        safeUserQuery += " LIMIT 200";
      }
      safeUserQuery += ";";

      let userRes = await dbInstance.query(safeUserQuery);
      const userResult = {
        columns: userRes.fields?.map(f => f.name) || [],
        values: userRes.rows?.map(r => Object.values(r)) || [],
      };

      if (isSubmitting) {
        const expRes = await dbInstance.query(setupData.expectedQuery);
        const expectedResult = {
          columns: expRes.fields.map(f => f.name),
          values: expRes.rows.map(r => Object.values(r)),
        };

        const isCorrect = compareResults(
          userResult,
          expectedResult,
          setupData.rowOrderMatters,
          setupData.columnOrderMatters
        );

        return {
          userResult,
          expectedResult,
          isCorrect,
          feedback: isCorrect ? "Correct!" : "Try again",
        };
      } else {
        return { userResult };
      }
    } catch (err) {
      console.error("Client-side Execution Error:", err.message, err.response?.data?.error);
      let errorMessage = "An unknown error occurred.";
      if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
      } else if (err.message) {
          errorMessage = `SQL Error: ${err.message}`;
          if (err.message.includes("does not exist")) {
              errorMessage = "Error: A table or column in your query does not exist.";
          }
      }
      throw new Error(errorMessage);
    } finally {
        setLoading(false);
        setSubmitLoading(false);
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to run or submit your query! 🔐");
      navigate("/login");
      return false;
    }
    return true;
  };
  
  const handleRun = async () => {
    if (!checkAuth()) return;
    setResult(null);
    setError("");
    if (!validateQuery()) return;

    try {
      const res = await executeClientQuery(false);
      if (!res.userResult || res.userResult.values.length === 0) {
        setError("Query executed successfully, but returned no results.");
        setResult(null);
      } else {
        setResult({ userResult: res.userResult });
      }
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!checkAuth()) return;
    setResult(null);
    setError("");
    if (!validateQuery()) return;

    try {
      const submissionData = await executeClientQuery(true);
      if (submissionData.isCorrect) {
        const token = localStorage.getItem("token");
        await axios.post(
          "https://datalemur-1.onrender.com/api/submission/submit",
          { questionId, userQuery: query, isCorrect: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      onSubmission(submissionData);
    } catch (err) {
      setError(err.message);
      console.error("Submission Error:", err);
    }
  };

  useEffect(() => {
    if (initialQuery) setQuery(initialQuery);
    else setQuery("-- Write your SQL query here");
  }, [initialQuery]);

  const handleReset = () => {
    setQuery("-- Write your SQL query here");
    setResult(null);
    setError("");
    if (onReset) onReset();
  };

  return (
    <div className="flex flex-col h-full p-6 md:p-8 bg-gray-50 shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">SQL Playground</h2>

      <div className="flex-shrink-0 mb-4">
        <CodeMirror
          value={query}
          height="300px"
          extensions={[sql(), EditorView.lineWrapping]}
          onChange={(value) => setQuery(value)}
          theme="light"
          className="border border-gray-300 shadow-sm rounded"
        />
      </div>

      {!localStorage.getItem("token") && (
        <div className="flex justify-end mb-2">
          <p className="text-orange-600 text-sm font-medium bg-orange-50 px-3 py-1 rounded-md border border-orange-200">
            ⚠️ You are in preview mode. Please login to execute or submit queries.
          </p>
        </div>
      )}

      <div className="flex justify-end gap-4 mb-4 flex-shrink-0">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full
                     border border-gray-400 text-gray-600 hover:text-red-600 hover:border-red-600
                     transition duration-200"
        >
          <FaSyncAlt /> Reset
        </button>

        <button
          onClick={handleRun}
          disabled={loading || submitLoading}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full
                      border ${loading || submitLoading ? "border-gray-400 text-gray-400 cursor-not-allowed" : "border-red-600 text-red-600 hover:text-white hover:bg-red-600"}
                      transition duration-200`}
        >
          <FaPlay /> Run
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading || submitLoading}
          className={`flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-full
                      border ${loading || submitLoading ? "border-gray-400 text-gray-400 cursor-not-allowed" : "border-red-600 text-red-600 hover:text-white hover:bg-red-600"}
                      transition duration-200`}
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
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className="px-4 py-2 text-sm text-gray-900 break-words max-w-[200px]"
                      >
                        {String(cell)}
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
