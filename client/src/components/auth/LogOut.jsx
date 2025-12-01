import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Cookies.remove("token");
    Cookies.remove("role");
    navigate("/login");
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <p className="text-green-700 font-semibold text-lg">Logging out...</p>
    </div>
  );
};

export default Logout;
