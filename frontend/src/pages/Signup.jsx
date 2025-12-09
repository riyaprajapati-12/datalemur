import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post("https://datalemur-1.onrender.com/api/auth/signup", form);
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Signup</h2>
        <input name="name" placeholder="Name" onChange={handleChange} className="w-full border p-2 mb-2" />
        <input name="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 mb-2" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full border p-2 mb-2" />
        <button className="bg-indigo-600 text-white w-full py-2">Signup</button>
        <p className="mt-2 text-sm">
          Already have account? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
