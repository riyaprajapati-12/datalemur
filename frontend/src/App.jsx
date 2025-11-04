import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuestionList from "./pages/QuestionList";
import Layout from "./pages/Layout";
// import AuthPage from "./pages/AuthPage";
function App() {
  return (
    <Router>
      <Routes>
      
        <Route path="/" element={<QuestionList />} />

       <Route path="/layout/:id" element={<Layout/>}/>
        
      </Routes>
    </Router>
  );
}

export default App;

//https://github.com/datawan-labs/pg.git
