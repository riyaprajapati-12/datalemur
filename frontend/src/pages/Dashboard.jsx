import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-white rounded-xl shadow-xl p-8 w-[350px] text-center">
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          DataLemur
        </h1>
        <p className="text-gray-500 mb-6">
          Practice SQL. Crack Interviews.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg mb-3 transition"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/signup")}
          className="w-full border border-green-600 text-green-600 hover:bg-green-50 py-2 rounded-lg transition"
        >
          Signup
        </button>

      </div>
    </div>
  );
};

export default Dashboard;
