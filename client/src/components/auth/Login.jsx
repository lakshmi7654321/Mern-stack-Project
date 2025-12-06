import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
       const res = await fetch("https://mern-stack-project-1-ahdo.onrender.com/api/auth/login",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success || !data.user || !data.token) {
        setMsg(data.message || "Invalid email or password");
        setPassword("");
        setLoading(false);
        return;
      }

      // Save JWT and user role in cookies
      Cookies.set("token", data.token, { expires: 7 });
      Cookies.set("role", data.user.role, { expires: 7 });

      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error(err);
      setMsg("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-4xl font-bold text-green-700 text-center mb-8">
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-xl text-lg
                       focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-xl text-lg
                       focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white p-3 rounded-xl text-lg font-semibold
                        hover:bg-green-700 transition ${
                          loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-700">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-green-700 font-bold hover:underline"
          >
            Sign Up
          </Link>
        </p>

        {msg && (
          <p className="mt-4 text-center text-red-600 font-medium">{msg}</p>
        )}
      </div>
    </div>
  );
};

export default Login;
