import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { navlinks } from "./utils/constant";
import { ShoppingBag, LogIn, LogOut, Menu, X } from "lucide-react";
import SearchBar from "./components/user/search/SearchBar";

const NavBar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // MOBILE MENU STATE

  const navigate = useNavigate();
  const location = useLocation();

  //-----------------------------------
  // Fetch user details
  //-----------------------------------
  const fetchUserFromBackend = async () => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const res = await fetch("https://mern-stack-project-1-ahdo.onrender.com/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      const data = await res.json();
      const user = data?.data || data?.user;

      if (user) {
        setUserName(user.name);
        setUserRole(user.role);
        Cookies.set("user", JSON.stringify(user));
        Cookies.set("role", user.role);
      }
    } catch (err) {
      console.log("User fetch error:", err);
    }
  };

  //-----------------------------------
  // Update User + Cart from Cookies
  //-----------------------------------
  const updateUserAndCart = () => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    const userCookie = Cookies.get("user");
    const user = userCookie ? JSON.parse(userCookie) : null;

    setIsLoggedIn(!!token);
    setUserRole(role || user?.role || "");
    setUserName(user?.name || "");

    try {
      const orders = Cookies.get("orders");
      const savedOrders = orders ? JSON.parse(orders) : [];
      setCartCount(savedOrders.length);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateUserAndCart();
    fetchUserFromBackend();
    window.addEventListener("storage", updateUserAndCart);
    return () => window.removeEventListener("storage", updateUserAndCart);
  }, []);

  //-----------------------------------
  // Logout
  //-----------------------------------
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    Cookies.remove("role");
    setIsLoggedIn(false);
    setUserName("");
    setUserRole("");
    navigate("/login");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex justify-between items-center h-16 md:h-20">

            {/* LOGO */}
            <h1
              className="text-3xl md:text-4xl font-bold cursor-pointer"
              onClick={() => navigate("/")}
            >
              FOOD<span className="text-green-600">IED</span>
            </h1>

            {/* Mobile Hamburger Menu */}
            <div className="md:hidden">
              {!menuOpen ? (
                <Menu size={32} className="cursor-pointer" onClick={() => setMenuOpen(true)} />
              ) : (
                <X size={32} className="cursor-pointer" onClick={() => setMenuOpen(false)} />
              )}
            </div>

            {/* Desktop Navigation */}
            {isLoggedIn && userRole === "user" && (
              <div className="hidden md:flex flex-1 justify-center text-xl space-x-8">
                {navlinks.links.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`font-bold transition ${
                        isActive ? "text-green-600 border-b-2 border-green-600" : "hover:text-green-600"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center space-x-6">
              {isLoggedIn ? (
                userRole === "user" ? (
                  <>
                    <SearchBar />

                    {/* CART */}
                    <div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
                      <ShoppingBag className="w-8 h-8 text-black" />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                          {cartCount}
                        </span>
                      )}
                    </div>

                    {/* PROFILE */}
                    <button onClick={() => navigate("/profile")}>
                      <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                        {userName ? userName[0].toUpperCase() : "?"}
                      </div>
                    </button>

                    <button onClick={handleLogout}>
                      <LogOut className="w-8 h-8 text-black" />
                    </button>
                  </>
                ) : (
                  <button onClick={handleLogout} className="flex items-center gap-2">
                    <LogOut className="w-8 h-8 text-black" />
                    <span className="font-semibold">Logout</span>
                  </button>
                )
              ) : (
                <button onClick={() => navigate("/login")}>
                  <LogIn className="w-8 h-8 text-black" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ---------------- MOBILE MENU ---------------- */}
        {menuOpen && (
          <div className="md:hidden w-full bg-white shadow-lg py-4 px-6 space-y-4">

            {/* Search */}
            {isLoggedIn && userRole === "user" && <SearchBar />}

            {/* NAVLINKS */}
            {isLoggedIn && userRole === "user" && (
              <div className="space-y-4 text-lg font-semibold">
                {navlinks.links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className="block hover:text-green-600"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}

            {/* USER ACTIONS */}
            <div className="flex items-center justify-between pt-3 border-t">
              {/* CART */}
              {isLoggedIn && userRole === "user" && (
                <button onClick={() => navigate("/cart")} className="relative">
                  <ShoppingBag className="w-8 h-8" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}

              {/* PROFILE */}
              {isLoggedIn && (
                <button onClick={() => navigate("/profile")}>
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                    {userName ? userName[0].toUpperCase() : "?"}
                  </div>
                </button>
              )}

              {/* LOGIN / LOGOUT */}
              {!isLoggedIn ? (
                <button onClick={() => navigate("/login")} className="text-lg flex items-center gap-1">
                  <LogIn /> Login
                </button>
              ) : (
                <button onClick={handleLogout} className="text-lg flex items-center gap-1">
                  <LogOut /> Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* spacing so content not hidden */}
      <div className="h-24 md:h-28"></div>
    </>
  );
};

export default NavBar;
