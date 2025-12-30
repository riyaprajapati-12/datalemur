import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaCheckCircle } from "react-icons/fa";

const QuestionList = ({ solvedQuestions }) => {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(
          "https://datalemur-1.onrender.com/api/questions"
        );
        setQuestions(res.data);
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const filteredQuestions = questions
    .filter((q) =>
      difficultyFilter === "All" ? true : q.difficulty === difficultyFilter
    )
    .filter(
      (q) =>
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getDifficultyStyle = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600";
      case "Medium":
        return "text-yellow-600";
      case "Hard":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const difficultyLevels = ["All", "Easy", "Medium", "Hard"];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500 text-lg">Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-red-600">
            SQLQuist Problems
          </h1>
          <p className="mt-2 text-gray-600 text-lg">
            Practice real interview-level SQL questions.
          </p>
          <div className="w-20 h-1 bg-red-600 mt-4 rounded-full"></div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          
          {/* Difficulty Filter */}
          <div className="flex border border-gray-300 rounded-full overflow-hidden">
            {difficultyLevels.map((level) => (
              <button
                key={level}
                onClick={() => setDifficultyFilter(level)}
                className={`px-5 py-2 text-sm font-semibold transition ${
                  difficultyFilter === level
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-700 hover:bg-red-50"
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-grow">
            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or company"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full
              focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          
          {/* Table Head */}
          <div className="grid grid-cols-12 bg-red-50 px-6 py-3 text-sm font-semibold text-gray-700">
            <div className="col-span-5">Title</div>
            <div className="col-span-3">Difficulty</div>
            <div className="col-span-4">Company</div>
          </div>

          {/* Rows */}
          {filteredQuestions.map((q) => (
            <Link
              key={q.id}
              to={`/layout/${q.id}`}
              className="grid grid-cols-12 px-6 py-4 border-t
              hover:bg-red-50 transition"
            >
              <div className="col-span-5 font-medium text-gray-800 flex items-center">
                {solvedQuestions.includes(q.id) && (
                  <FaCheckCircle className="text-green-500 mr-2" />
                )}
                {q.title}
              </div>
              <div
                className={`col-span-3 font-semibold ${getDifficultyStyle(
                  q.difficulty
                )}`}
              >
                {q.difficulty}
              </div>
              <div className="col-span-4 text-gray-600">
                {q.company_name}
              </div>
            </Link>
          ))}

          {filteredQuestions.length === 0 && (
            <p className="text-center py-10 text-gray-500">
              No questions found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionList;
