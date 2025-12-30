import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuestionList from "./pages/QuestionList";
import Layout from "./pages/Layout";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  useEffect(() => {
    fetch("/api/test")
      .then((res) => res.json())
      .then((data) => console.log(data.message));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/questionList" element={<QuestionList />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/layout/:id" element={<Layout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;

//https://github.com/datawan-labs/pg.git
