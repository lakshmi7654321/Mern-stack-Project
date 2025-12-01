import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children, role }) => {
  const token = Cookies.get("token");
  const userRole = Cookies.get("role");
  const location = useLocation();

  // 1️⃣ NOT LOGGED IN → send to login
  if (!token || !userRole) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2️⃣ ROLE-BASED ACCESS CHECK
  if (role && userRole !== role) {
    // If user is admin but trying to access user pages
    if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    // If normal user tries to access admin-only pages
    return <Navigate to="/" replace />;
  }

  // 3️⃣ USER IS AUTHORIZED → render component
  return children;
};

export default ProtectedRoute;
