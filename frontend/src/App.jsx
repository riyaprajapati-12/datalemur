import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuestionList from "./pages/QuestionList";
import Layout from "./pages/Layout";
import Singup from "./pages/Signup"
import Login from "./pages/Login"
// import AuthPage from "./pages/AuthPage";
function App() {
  return (
    <Router>
      <Routes>
      
        <Route path="/" element={<QuestionList />} />

       <Route path="/layout/:id" element={<Layout/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
      </Routes>
    </Router>
  );
}

export default App;

//https://github.com/datawan-labs/pg.git
