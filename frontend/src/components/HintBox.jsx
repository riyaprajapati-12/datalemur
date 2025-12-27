import { useState } from "react";

const HintBox = ({ hints = [] }) => {
  const [visibleCount, setVisibleCount] = useState(0);

  const showNextHint = () => {
    setVisibleCount(prev =>
      prev < hints.length ? prev + 1 : prev
    );
  };

  const hideAllHints = () => {
    setVisibleCount(0);
  };

  if (hints.length === 0) {
    return (
      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Hints
        </h2>
        <p className="text-gray-500 text-sm">
          No hints available for this question.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Hints
        </h2>
        <span className="text-sm text-gray-500">
          {visibleCount}/{hints.length}
        </span>
      </div>

      {/* Hints List */}
      <div className="space-y-3">
        {hints.slice(0, visibleCount).map((hint, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-md overflow-hidden"
          >
            <div className="px-4 py-2 bg-gray-100">
              <h3 className="font-medium text-gray-800">
                Hint {idx + 1}
              </h3>
            </div>
            <div className="p-4 text-gray-700 text-sm leading-relaxed">
              {hint}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3 mt-5">
        {visibleCount < hints.length && (
          <button
            onClick={showNextHint}
            className="px-4 py-2 text-sm font-semibold rounded-md
                       border border-red-600 text-red-600 hover:text-white hover:bg-red-600
                       transition duration-200"
          >
            Show Next Hint
          </button>
        )}

        {visibleCount > 0 && (
          <button
            onClick={hideAllHints}
            className="px-4 py-2 text-sm font-semibold rounded-md
                       border border-gray-400 text-gray-600 hover:text-red-600 hover:border-red-600
                       transition duration-200"
          >
            Hide All Hints
          </button>
        )}
      </div>
    </div>
  );
};

export default HintBox;

