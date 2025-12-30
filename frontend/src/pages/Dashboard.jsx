import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      
      {/* Logo / Name */}
      <h1 className="text-5xl font-extrabold mb-4 text-red-600 tracking-wide">
        SQLQuist
      </h1>

      {/* Tagline */}
      <p className="text-gray-700 mb-10 text-lg text-center max-w-md">
        Master SQL. Crack Interviews.  
        Practice real-world SQL questions with confidence.
      </p>

      {/* Divider */}
      <div className="w-24 h-1 bg-red-600 mb-10 rounded-full"></div>

      {/* CTA Button */}
      <button
        onClick={() => navigate("/questionList")}
        className="px-10 py-4 text-lg font-semibold text-white rounded-full
        bg-red-600 hover:bg-red-700
        transition-all duration-300 transform hover:scale-105 shadow-xl"
      >
        Start Practicing
      </button>

    </div>
  );
};

export default Dashboard;

