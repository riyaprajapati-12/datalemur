import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import QuestionList from "./pages/QuestionList";
import Layout from "./pages/Layout";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import axios from "axios";

function AppContent() {
  const [solvedQuestions, setSolvedQuestions] = useState([]);
  const location = useLocation();

  const handleQuestionSolved = (questionId) => {
  const id = Number(questionId);
  setSolvedQuestions(prev => [...new Set([...prev, id])]);
};


  useEffect(() => {
    const fetchSolvedQuestions = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get("https://datalemur-1.onrender.com/api/submission/solved", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSolvedQuestions(
  Array.isArray(res.data)
    ? res.data.map(q => Number(q.id || q.questionId || q))   // safe conversion
    : []
);

        } catch (err) {
          console.error("Error fetching solved questions:", err);
        }
      }
    };
    fetchSolvedQuestions();
  }, [location]);

  return (
    <Routes>
      <Route path="/questionList" element={<QuestionList solvedQuestions={solvedQuestions} />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/layout/:id" element={<Layout handleQuestionSolved={handleQuestionSolved} solvedQuestions={solvedQuestions} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
