import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(
      "https://datalemur-1.onrender.com/api/auth/signup",
      form
    );
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm">
        
        {/* Brand */}
        <h1 className="text-4xl font-extrabold text-red-600 text-center mb-2">
          SQLQuist
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Create your account to start practicing SQL
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="name"
            type="text"
            placeholder="Full name"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            name="email"
            type="email"
            placeholder="Email address"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-full font-semibold text-white
            bg-red-600 hover:bg-red-700 transition transform hover:scale-105"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
