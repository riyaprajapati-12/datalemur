import { useState } from "react";
import { FaEye, FaEyeSlash, FaCopy, FaCheck } from "react-icons/fa";

// Highlighter colors ko light background ke liye update kiya gaya hai
const highlightSQL = (query) => {
  if (!query) return "";

  const keywords = [
    "SELECT", "FROM", "WHERE", "IS", "NULL", "AND", "OR", "GROUP BY", "ORDER BY",
    "CASE", "WHEN", "THEN", "ELSE", "END", "SUM", "LOWER", "JOIN", "ON", "AS"
  ];

  query = query.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const tokens = query.split(/(\s+|[\(\)=,;])/);

  const highlighted = tokens
    .map((token) => {
      // Strings
      if (/^'.*'$/.test(token)) {
        return `<span class="text-green-700">${token}</span>`;
      }
      // Numbers
      if (/^\d+(\.\d+)?$/.test(token)) {
        return `<span class="text-red-600">${token}</span>`;
      }
      // Keywords
      if (keywords.includes(token.toUpperCase())) {
        return `<span class="text-purple-700 font-semibold">${token}</span>`;
      }
      // Default
      return `<span class="text-gray-800">${token}</span>`;
    })
    .join("");

  return highlighted;
};

export default function Solution({ solution }) {
  const [showCode, setShowCode] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (solution.expected_query) {
      navigator.clipboard.writeText(solution.expected_query);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Solution
        </h2>
        <button
          onClick={() => setShowCode(!showCode)}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition"
          title={showCode ? "Hide Code" : "Show Code"}
        >
          {showCode ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </button>
      </div>

      <p className="text-gray-700 mb-6 prose">
        {solution.solution_explanation}
      </p>

      {/* Code block ka light theme wala design */}
      {showCode && (
        // Main code block ka background ab light gray hai
        <div className="border border-gray-200 rounded-xl transition-all duration-300">
          {/* Header ka background bhi light theme ke anusaar */}
          <div className="flex justify-between items-center px-4 py-2 bg-gray-100 border-b border-gray-200 rounded-t-xl">
            <p className="text-xs font-semibold text-gray-600">SQL Query</p>
            {/* Button aur text colors bhi update kiye gaye */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-xs px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
            >
              {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          
          <pre
            className="p-4 overflow-x-auto bg-white rounded-b-xl"
            style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
            dangerouslySetInnerHTML={{ __html: highlightSQL(solution.expected_query) }}
          />
        </div>
      )}
    </div>
  );
}