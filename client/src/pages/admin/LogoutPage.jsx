import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-xl">Logging out...</h1>
    </AdminLayout>
  );
};

export default LogoutPage;
