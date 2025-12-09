import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await axios.post("https://datalemur-1.onrender.com/api/auth/login", form);
    localStorage.setItem("token", res.data.token);
    navigate("/layout/1");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input name="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 mb-2" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full border p-2 mb-2" />
        <button className="bg-green-600 text-white w-full py-2">Login</button>
        <p className="mt-2 text-sm">
          New user? <Link to="/signup" className="text-blue-600">Signup</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
