import React from "react";
import { NavLink } from "react-router-dom";
import { adminNavLinks } from "../../utils/adminConstants";

const AdminNavbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("adminLogged");
    window.location.href = "/login"; 
  };

  return (
    <nav className="fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-red-700 to-red-500 shadow-2xl p-6 flex flex-col z-50">
     
      <h2 className="text-3xl font-bold text-white text-center mb-10 tracking-wide">
        Admin Panel
      </h2>

      
      <ul className="flex flex-col gap-4">
        {adminNavLinks.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300
                ${
                  isActive
                    ? "bg-white text-red-700 shadow-lg scale-105"
                    : "text-white hover:bg-red-600 hover:scale-[1.03]"
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      
      <button
        onClick={handleLogout}
        className="mt-auto bg-white text-red-700 font-semibold py-3 rounded-xl hover:bg-gray-100 shadow-md transition-all"
      >
        Logout
      </button>
    </nav>
  );
};

export default AdminNavbar;
