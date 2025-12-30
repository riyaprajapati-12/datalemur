import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-white via-red-50 to-white px-6">

      {/* Main Card */}
      <div className="bg-white/80 backdrop-blur-md 
        rounded-3xl shadow-2xl p-12 max-w-xl w-full text-center">

        {/* Logo / Name */}
        <h1 className="text-6xl font-extrabold mb-4 
          text-red-600 tracking-wide">
          SQLQuist
        </h1>

        {/* Tagline */}
        <p className="text-gray-700 mb-8 text-lg leading-relaxed">
          Master SQL. Crack Interviews. <br />
          Practice real-world SQL questions with confidence.
        </p>

        {/* Divider */}
        <div className="flex justify-center mb-10">
          <div className="w-24 h-1 bg-red-600 rounded-full"></div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate("/questionList")}
          className="px-12 py-4 text-lg font-semibold text-white rounded-full
          bg-red-600 hover:bg-red-700
          transition-all duration-300 transform 
          hover:scale-105 hover:shadow-red-300 shadow-xl"
        >
          🚀 Start Practicing
        </button>

        {/* Footer Hint */}
        <p className="mt-8 text-sm text-gray-500">
          Built for interview-focused SQL preparation
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
