import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";

// Use environment variable for backend URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SigninPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important for cookies
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        setMsg(errData.message || "Signup failed");
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (!data.success || !data.token || !data.user) {
        setMsg(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      // Save JWT and role in cookies
      Cookies.set("token", data.token, { expires: 7 });
      Cookies.set("role", data.user.role, { expires: 7 });

      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Signup error:", err);
      setMsg("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 px-4">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl w-full max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-green-700 mb-8">
          Create an Account
        </h2>

        <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "name", type: "text", placeholder: "Full Name" },
            { name: "email", type: "email", placeholder: "Email Address" },
            { name: "password", type: "password", placeholder: "Password" },
            { name: "phone", type: "text", placeholder: "Phone" },
            { name: "address", type: "text", placeholder: "Address" },
            { name: "city", type: "text", placeholder: "City" },
            { name: "state", type: "text", placeholder: "State" },
          ].map((field) => (
            <input
              key={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl text-lg
                         focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          ))}

          <button
            type="submit"
            disabled={loading}
            className={`md:col-span-2 w-full bg-green-600 text-white p-3 rounded-xl text-lg font-semibold
                        hover:bg-green-700 transition ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-lg md:mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-green-700 font-bold hover:underline">
            Login
          </Link>
        </p>

        {msg && (
          <p className="mt-4 text-center text-base text-red-600 font-medium">{msg}</p>
        )}
      </div>
    </div>
  );
};

export default SigninPage;
