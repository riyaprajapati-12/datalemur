import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-4xl w-full text-center">

        {/* Logo */}
        <h1 className="text-6xl font-extrabold text-red-600 tracking-wider drop-shadow-sm">
          SQLQuist
        </h1>

        {/* Tagline */}
        <p className="text-gray-700 mt-4 text-lg max-w-2xl mx-auto">
          Master SQL. Crack Interviews.  
          Practice real-world SQL questions with confidence.
        </p>

        {/* Divider */}
        <div className="w-24 h-1 bg-red-600 mt-6 mb-10 rounded-full mx-auto"></div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="border border-gray-200 rounded-2xl p-5 hover:shadow-xl transition shadow-sm">
            <h3 className="font-bold text-red-600 text-lg mb-2">🔥 Real Interview SQL</h3>
            <p className="text-gray-600 text-sm">
              Practice questions asked in top companies
            </p>
          </div>

          <div className="border border-gray-200 rounded-2xl p-5 hover:shadow-xl transition shadow-sm">
            <h3 className="font-bold text-red-600 text-lg mb-2">🎯 Track Progress</h3>
            <p className="text-gray-600 text-sm">
              See solved questions & improve daily
            </p>
          </div>

          <div className="border border-gray-200 rounded-2xl p-5 hover:shadow-xl transition shadow-sm">
            <h3 className="font-bold text-red-600 text-lg mb-2">⚡ Instant Execution</h3>
            <p className="text-gray-600 text-sm">
              Run queries instantly in our built-in editor
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/questionList")}
            className="px-10 py-4 text-lg font-semibold text-white rounded-full
            bg-red-600 hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Start Practicing
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-8 py-4 text-lg font-semibold text-red-600 border-2 border-red-600 rounded-full
            hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
