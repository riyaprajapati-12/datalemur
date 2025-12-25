import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020024] via-[#090979] to-[#00d4ff]">
      
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-10 w-[380px] text-center">
        
        <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text tracking-wide">
          SQLQuist
        </h1>

        <p className="text-gray-200 mb-8 text-sm tracking-wider">
          Master SQL • Conquer Interviews
        </p>

        <button
          onClick={() => navigate("/questionList")}
          className="w-full py-3 rounded-xl font-semibold text-white
          bg-gradient-to-r from-orange-500 to-yellow-500
          hover:from-orange-400 hover:to-yellow-400
          transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          ⚔️ Start Your Quest
        </button>

      </div>
    </div>
  );
};

export default Dashboard;
