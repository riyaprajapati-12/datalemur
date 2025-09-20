
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Playground from "../components/Playground";
import QuestionTabs from "../components/QuestionTabs";
import Stopwatch from "../components/Stopwatch";
// Import a database icon for the new logo
import { FaDatabase, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Layout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submissionData, setSubmissionData] = useState(null);
  const [activeTab, setActiveTab] = useState("Question");

  useEffect(() => {
    setLoading(true);
    setActiveTab("Question");
    setSubmissionData(null);

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/api/question/${id}`);
        setQuestion(res.data);
        const allRes = await axios.get(`http://localhost:8081/api/questions`);
        setTotalQuestions(allRes.data.length);
      } catch (err) {
        console.error("Error fetching question:", err);
        setQuestion(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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
  };
  
  const handleNextQuestion = () => {
    if (totalQuestions === 0) return;
    let currentId = parseInt(id);
    let nextId = currentId + 1;
    if (nextId > totalQuestions) {
      nextId = 1;
    }
    navigate(`/layout/${nextId}`);
  };

  const handlePreviousQuestion = () => {
    if (totalQuestions === 0) return;
    let currentId = parseInt(id);
    let prevId = currentId - 1;
    if (prevId < 1) {
      prevId = totalQuestions;
    }
    navigate(`/layout/${prevId}`);
  };

  if (loading) {
    return <div className="text-center py-24 text-gray-500">Loading...</div>;
  }

  if (!question) {
    return (
      <div className="text-center py-24 text-red-500">
        Question not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="flex items-center justify-between p-2 bg-white border-b shadow-sm flex-shrink-0">
        {/* NEW: Stylish Logo Link instead of Home button */}
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-800 hover:text-indigo-600 transition-colors duration-200 ml-2 group"
          title="Back to Question List"
        >
          <div className="p-2 bg-indigo-600 rounded-lg group-hover:bg-indigo-700 transition-colors duration-200">
            <FaDatabase className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">SQL-Practice</span>
        </Link>
        
        <Stopwatch />
        
        <div className="flex items-center gap-4 mr-2">
            <button 
                onClick={handlePreviousQuestion} 
                className="p-3 rounded-full hover:bg-gray-200 transition" 
                title="Previous Question"
            >
                <FaChevronLeft className="text-gray-600" />
            </button>
            <button 
                onClick={handleNextQuestion} 
                className="p-3 rounded-full hover:bg-gray-200 transition" 
                title="Next Question"
            >
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
          />
        </div>
      </div>
    </div>
  );
};

export default Layout;