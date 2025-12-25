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
  const [initialQuery, setInitialQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setActiveTab("Question");
        setSubmissionData(null);
        setInitialQuery("");

        const questionRes = await axios.get(
          `https://datalemur-1.onrender.com/api/question/${id}`
        );
        setQuestion(questionRes.data);

        const allQuestionsRes = await axios.get(
          `https://datalemur-1.onrender.com/api/questions`
        );
        setTotalQuestions(allQuestionsRes.data.length);

        const token = localStorage.getItem("token");
        if (token) {
          try {
            const latestRes = await axios.get(
              `https://datalemur-1.onrender.com/api/submission/latest/${id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (latestRes.data) {
              setInitialQuery(latestRes.data.userQuery);
              setActiveTab("Submissions");
            }
          } catch {
            console.log("No previous submission");
          }
        }
      } catch (err) {
        console.error(err);
        setQuestion(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (submissionData?.isCorrect) {
      const timer = setTimeout(handleNextQuestion, 2000);
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
    let nextId = parseInt(id) + 1;
    if (nextId > totalQuestions) nextId = 1;
    navigate(`/layout/${nextId}`);
  };

  const handlePreviousQuestion = () => {
    let prevId = parseInt(id) - 1;
    if (prevId < 1) prevId = totalQuestions;
    navigate(`/layout/${prevId}`);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-500">
        Loading...
      </div>
    );

  if (!question)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Question not found
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-white">
      
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-white">
        <Link
          to="/questionList"
          className="flex items-center gap-3 text-red-600 font-extrabold text-xl"
        >
          <div className="p-2 bg-red-600 rounded-lg">
            <FaDatabase className="text-white" />
          </div>
          SQLQuist
        </Link>

        <Stopwatch />

        <div className="flex gap-2">
          <button
            onClick={handlePreviousQuestion}
            className="p-3 rounded-full hover:bg-red-50"
          >
            <FaChevronLeft className="text-red-600" />
          </button>
          <button
            onClick={handleNextQuestion}
            className="p-3 rounded-full hover:bg-red-50"
          >
            <FaChevronRight className="text-red-600" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-col md:flex-row flex-grow overflow-hidden p-3 gap-3">
        
        {/* Question Section */}
        <div className="w-full md:w-1/2 border border-gray-200 rounded-xl overflow-y-auto">
          <QuestionTabs
            question={question}
            submissionData={submissionData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Playground */}
        <div className="w-full md:w-1/2 border border-gray-200 rounded-xl overflow-y-auto">
          <Playground
            questionId={id}
            totalQuestions={totalQuestions}
            onSubmission={handleSubmission}
            onReset={handleResetView}
            initialQuery={initialQuery}
          />
        </div>
      </div>
    </div>
  );
};

export default Layout;
