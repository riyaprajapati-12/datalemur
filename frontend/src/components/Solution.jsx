import { useState } from "react";
import { FaEye, FaEyeSlash, FaCopy, FaCheck } from "react-icons/fa";

/* SQL Highlighter – SQLQuist Theme */
const highlightSQL = (query) => {
  if (!query) return "";

  const keywords = [
    "SELECT","FROM","WHERE","IS","NULL","AND","OR",
    "GROUP BY","ORDER BY","CASE","WHEN","THEN",
    "ELSE","END","SUM","LOWER","JOIN","ON","AS"
  ];

  query = query.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const tokens = query.split(/(\s+|[\(\)=,;])/);

  return tokens
    .map((token) => {
      if (/^'.*'$/.test(token))
        return `<span class="text-green-600">${token}</span>`;

      if (/^\d+(\.\d+)?$/.test(token))
        return `<span class="text-red-600">${token}</span>`;

      if (keywords.includes(token.toUpperCase()))
        return `<span class="text-red-700 font-semibold">${token}</span>`;

      return `<span class="text-gray-800">${token}</span>`;
    })
    .join("");
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
    <div className="h-full p-5 bg-white">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-extrabold text-red-600">
          Solution
        </h2>

        <button
          onClick={() => setShowCode(!showCode)}
          className="p-2 rounded-full text-red-600 hover:bg-red-50 transition"
          title={showCode ? "Hide Code" : "Show Code"}
        >
          {showCode ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
      </div>

      {/* Explanation */}
      <p className="text-gray-700 mb-6 leading-relaxed">
        {solution.solution_explanation}
      </p>

      {/* SQL Code Block */}
      {showCode && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          
          {/* Code Header */}
          <div className="flex justify-between items-center px-4 py-2 bg-red-50 border-b">
            <span className="text-xs font-semibold text-gray-700">
              SQL Query
            </span>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-xs px-3 py-1.5
              border border-red-200 text-red-600 rounded-md
              hover:bg-red-100 transition"
            >
              {copied ? <FaCheck /> : <FaCopy />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          {/* Code */}
          <pre
            className="p-4 text-sm bg-white overflow-x-auto"
            style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
            dangerouslySetInnerHTML={{
              __html: highlightSQL(solution.expected_query),
            }}
          />
        </div>
      )}
    </div>
  );
}
