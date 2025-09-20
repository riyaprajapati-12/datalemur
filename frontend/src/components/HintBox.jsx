import { useState } from "react";

const HintBox = ({ hints }) => {
  const [visibleHints, setVisibleHints] = useState(0);

  const showNextHint = () => {
    if (visibleHints < hints.length) {
      setVisibleHints(visibleHints + 1);
    }
  };

  const hideAllHints = () => {
    setVisibleHints(0);
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Hints</h2>

      {/* Accordion items ke liye container */}
      <div className="space-y-2">
        {hints.length === 0 ? (
          <p className="text-gray-500 text-sm">No hints available for this question.</p>
        ) : (
          hints.slice(0, visibleHints).map((hint, idx) => (
            // Har hint ek accordion item jaisa dikhega
            <div key={idx} className="bg-white border border-gray-200 rounded-md overflow-hidden">
              {/* Hint ka header */}
              <div className="px-4 py-2 bg-gray-100">
                <h3 className="font-medium text-gray-800">Hint {idx + 1}</h3>
              </div>
              {/* Hint ka content */}
              <div className="p-4 text-gray-700">
                {hint}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Control buttons */}
      <div className="flex gap-3 mt-4">
        {/* 'Show Hint' button tab tak dikhega jab tak saare hints na dikh jayein */}
        {visibleHints < hints.length && (
          <button
            onClick={showNextHint}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Show Next Hint
          </button>
        )}

        {/* 'Hide All' button tab dikhega jab kam se kam ek hint dikh raha ho */}
        {visibleHints > 0 && (
          <button
            onClick={hideAllHints}
            className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          >
            Hide All Hints
          </button>
        )}
      </div>
    </div>
  );
};

export default HintBox;