import QuestionPanel from "./QuestionPanel";
import Solution from "./Solution";
import Submission from "./Submission"; 

const tabs = ["Question", "Solution", "Discussion", "Submissions"];


export default function QuestionTabs({ question, submissionData, activeTab, setActiveTab }) {
  // Is component ki apni state ('useState') hata di gayi hai

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b bg-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              // Agar user Submissions tab par click kare aur koi submission na ho, to click na hone de
              if (tab === "Submissions" && !submissionData) {
                return; 
              }
              setActiveTab(tab);
            }}
            // Button ko disable karein agar Submissions tab hai aur data nahi hai
            disabled={tab === "Submissions" && !submissionData} 
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-600 hover:text-indigo-500"
            } ${
              // Styling ke liye disabled state ka istemal
              tab === "Submissions" && !submissionData 
                ? "cursor-not-allowed text-gray-400" 
                : ""
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "Question" && <QuestionPanel question={question} />}
        {activeTab === "Solution" && <Solution solution={question} />}
        {activeTab === "Discussion" && (
          <p className="text-gray-600">Discussion feature coming soon...</p>
        )}
        
        {/* Yahan logic badal gaya hai */}
        {activeTab === "Submissions" && (
          // Agar submissionData hai, to Submission component dikhayein
          submissionData ? (
            <Submission data={submissionData} />
          ) : (
            // Agar nahi hai, to message dikhayein
            <p className="text-gray-600">
              You have not made any submissions yet. Click 'Submit' to see your result.
            </p>
          )
        )}
      </div>
    </div>
  );
}