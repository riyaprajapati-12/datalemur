
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Playground from "../components/Playground";
import QuestionTabs from "../components/QuestionTabs";
import Stopwatch from "../components/Stopwatch";
import { FaDatabase, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Layout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submissionData, setSubmissionData] = useState(null);
  const [activeTab, setActiveTab] = useState("Question");
  
  // ✅ New state for existing query
  const [initialQuery, setInitialQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setActiveTab("Question");
        setSubmissionData(null);
        setInitialQuery(""); // Reset query for new question

        // 1. Fetch Question Data
        const questionRes = await axios.get(
          `https://datalemur-1.onrender.com/api/question/${id}`
        );
        setQuestion(questionRes.data);

        const allQuestionsRes = await axios.get(
          `https://datalemur-1.onrender.com/api/questions`
        );
        setTotalQuestions(allQuestionsRes.data.length);

        // 2. ✅ Fetch Previous Successful Submission
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const latestRes = await axios.get(
              `https://datalemur-1.onrender.com/api/submission/latest/${id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (latestRes.data) {
              setInitialQuery(latestRes.data.userQuery);
              // Agar user ne pehle solve kiya hai, toh direct Submission tab dikhayein
              setActiveTab("Submissions");
              
              // Note: Hum sirf query dikha rahe hain, 
              // Result table dikhane ke liye user ko ek baar 'Run' dabana hoga 
              // ya aap backend se result bhi bhej sakte hain.
            }
          } catch (err) {
            console.log("No previous submission found or error fetching it.");
          }
        }

      } catch (err) {
        console.error("Error fetching question data:", err);
        setQuestion(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Rest of your functions (handleNext, handlePrevious, etc.) remain same
  useEffect(() => {
    if (submissionData?.isCorrect) {
      const timer = setTimeout(() => {
        handleNextQuestion();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [submissionData]);

  const handleSubmission = (data) => {
    setSubmissionData(data);
    setActiveTab("Submissions");
  };

  const handleResetView = () => {
    setActiveTab("Question");
    setSubmissionData(null);
    setInitialQuery("");
  };

  const handleNextQuestion = () => {
    if (totalQuestions === 0) return;
    let currentId = parseInt(id);
    let nextId = currentId + 1;
    if (nextId > totalQuestions) nextId = 1;
    navigate(`/layout/${nextId}`);
  };

  const handlePreviousQuestion = () => {
    if (totalQuestions === 0) return;
    let currentId = parseInt(id);
    let prevId = currentId - 1;
    if (prevId < 1) prevId = totalQuestions;
    navigate(`/layout/${prevId}`);
  };

  if (loading) return <div className="text-center py-24 text-gray-500">Loading...</div>;
  if (!question) return <div className="text-center py-24 text-red-500">Question not found.</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="flex items-center justify-between p-2 bg-white border-b shadow-sm flex-shrink-0">
        <Link to="/questionList" className="flex items-center gap-2 text-gray-800 hover:text-indigo-600 ml-2 group">
          <div className="p-2 bg-indigo-600 rounded-lg group-hover:bg-indigo-700">
            <FaDatabase className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">SQL-Practice</span>
        </Link>
        <Stopwatch />
        <div className="flex items-center gap-4 mr-2">
          <button onClick={handlePreviousQuestion} className="p-3 rounded-full hover:bg-gray-200">
            <FaChevronLeft className="text-gray-600" />
          </button>
          <button onClick={handleNextQuestion} className="p-3 rounded-full hover:bg-gray-200">
            <FaChevronRight className="text-gray-600" />
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-2 flex-grow overflow-hidden p-2">
        <div className="w-full md:w-1/2 h-full overflow-y-auto border bg-white rounded-lg shadow-inner">
          <QuestionTabs
            question={question}
            submissionData={submissionData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        <div className="w-full md:w-1/2 h-full overflow-y-auto">
          <Playground
            questionId={id}
            totalQuestions={totalQuestions}
            onSubmission={handleSubmission}
            onReset={handleResetView}
            initialQuery={initialQuery} // ✅ Passing initialQuery to Playground
          />
        </div>
      </div>
    </div>
  );
};

export default Layout;