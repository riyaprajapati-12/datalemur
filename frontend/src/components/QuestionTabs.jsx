import QuestionPanel from "./QuestionPanel";
import Solution from "./Solution";
import Submission from "./Submission";

const tabs = ["Question", "Solution", "Discussion", "Submissions"];

export default function QuestionTabs({
  question,
  submissionData,
  activeTab,
  setActiveTab,
}) {
  return (
    <div className="h-full flex flex-col bg-white">
      
      {/* Tabs Header */}
      <div className="flex border-b border-gray-200 bg-white">
        {tabs.map((tab) => {
          const isDisabled = tab === "Submissions" && !submissionData;
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => {
                if (isDisabled) return;
                setActiveTab(tab);
              }}
              disabled={isDisabled}
              className={`
                px-5 py-3 text-sm font-semibold transition
                ${
                  isActive
                    ? "border-b-2 border-red-600 text-red-600"
                    : "text-gray-600 hover:text-red-500"
                }
                ${
                  isDisabled
                    ? "cursor-not-allowed text-gray-400 hover:text-gray-400"
                    : ""
                }
              `}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === "Question" && (
          <QuestionPanel question={question} />
        )}

        {activeTab === "Solution" && (
          <Solution solution={question} />
        )}

        {activeTab === "Discussion" && (
          <p className="text-gray-600">
            Discussion feature coming soon...
          </p>
        )}

        {activeTab === "Submissions" && (
          submissionData ? (
            <Submission data={submissionData} />
          ) : (
            <p className="text-gray-600">
              You have not made any submissions yet.  
              Click <span className="font-semibold text-red-600">Submit</span> to see your result.
            </p>
          )
        )}
      </div>
    </div>
  );
}
