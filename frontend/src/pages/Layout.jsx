import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Playground from "../components/Playground";
import QuestionTabs from "../components/QuestionTabs";
import Stopwatch from "../components/Stopwatch";
import { FaDatabase, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Layout = ({ handleQuestionSolved, solvedQuestions }) => {
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
    if (data.isCorrect) {
      handleQuestionSolved(Number(id));

    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-500">
        Loading...
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Question not found
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-white">
        <Link
          to="/questionList"
          className="flex items-center gap-3 text-red-600"
        >
          <FaChevronLeft />
          Back
        </Link>

        <div className="flex items-center gap-4">
          <FaDatabase className="text-gray-600" />
          <Stopwatch />
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">

  <div className="w-1/2 border-r overflow-hidden">
    <QuestionTabs
      question={question}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      submissionData={submissionData}
      onReset={handleResetView}
    />
  </div>

  <div className="w-1/2 overflow-hidden">
    <Playground
  questionId={question.id}
  onSubmission={handleSubmission}
  initialQuery={initialQuery}
/>

  </div>

</div>


      {/* Footer */}
      <footer className="flex items-center justify-between px-4 py-2 border-t">
        <button
          onClick={handlePreviousQuestion}
          className="flex items-center gap-2 text-sm text-gray-600"
        >
          <FaChevronLeft /> Previous
        </button>

        <button
          onClick={handleNextQuestion}
          className="flex items-center gap-2 text-sm text-gray-600"
        >
          Next <FaChevronRight />
        </button>
      </footer>
    </div>
  );
};

export default Layout;
