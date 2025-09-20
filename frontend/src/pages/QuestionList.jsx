import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaCheckCircle } from "react-icons/fa";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // Difficulty filter ke liye naya state
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/questions");
        setQuestions(res.data);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };
    fetchQuestions();
  }, []);

  // Filter logic ko update kiya gaya hai (difficulty aur search dono ke liye)
  const filteredQuestions = questions
    .filter((q) => {
      if (difficultyFilter === "All") return true;
      return q.difficulty === difficultyFilter;
    })
    .filter(
      (q) =>
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Table me behtar dikhne ke liye style ko thoda badla gaya hai
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

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">SQL Problem Set</h1>
          <p className="mt-2 text-lg text-gray-600">Sharpen your SQL skills with our curated list of problems.</p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Difficulty Filters */}
          <div className="flex bg-gray-200 p-1 rounded-lg">
            {difficultyLevels.map((level) => (
              <button
                key={level}
                onClick={() => setDifficultyFilter(level)}
                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 ${
                  difficultyFilter === level
                    ? "bg-white text-gray-800 shadow"
                    : "bg-transparent text-gray-600 hover:bg-white/60"
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
            />
          </div>
        </div>

        {/* Question Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Table Header */}
          <div className="flex bg-gray-100 p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            <div className="w-1/12">Status</div>
            <div className="w-5/12">Title</div>
            <div className="w-2/12">Difficulty</div>
            <div className="w-4/12">Company</div>
          </div>

          {/* Table Body */}
          <div className="flex flex-col">
            {filteredQuestions.map((q) => (
              <Link
                key={q.id}
                to={`/layout/${q.id}`}
                className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="w-1/12">
                  {/* Future feature: Yahan solved status ke liye icon dikha sakte hain */}
                  {/* <FaCheckCircle className="text-green-500" /> */}
                </div>
                <div className="w-5/12 text-gray-800 font-semibold">{q.title}</div>
                <div className={`w-2/12 font-medium ${getDifficultyStyle(q.difficulty)}`}>
                  {q.difficulty}
                </div>
                <div className="w-4/12 text-gray-500">{q.company_name}</div>
              </Link>
            ))}

            {filteredQuestions.length === 0 && (
              <p className="text-gray-500 text-center p-8">No questions found matching your criteria.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionList;