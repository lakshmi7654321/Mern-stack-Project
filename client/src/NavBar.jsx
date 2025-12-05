import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { navlinks } from "./utils/constant";
import { ShoppingBag, LogIn, LogOut } from "lucide-react";
import SearchBar from "./components/user/search/SearchBar";

const NavBar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // -------------------------
  // Fetch user details from backend 
  // -------------------------
  const fetchUserFromBackend = async () => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      const data = await res.json();
      const user = data?.data || data?.user;

      if (user) {
        setUserName(user.name);
        setUserRole(user.role);

        // Save in cookies also
        Cookies.set("user", JSON.stringify(user));
        Cookies.set("role", user.role);
      }
    } catch (err) {
      console.log("User fetch error:", err);
    }
  };

  // -------------------------
  // Read cookies & update login/cart info
  // -------------------------
  const updateUserAndCart = () => {
    try {
      const token = Cookies.get("token");
      const role = Cookies.get("role");
      const userCookie = Cookies.get("user");
      const user = userCookie ? JSON.parse(userCookie) : null;

      setIsLoggedIn(!!token);
      setUserRole(role || user?.role || "");
      setUserName(user?.name || "");
    } catch (err) {
      console.error("Error reading cookies:", err);
      setIsLoggedIn(false);
      setUserName("");
      setUserRole("");
    }

    // Cart count from cookies
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

  // -------------------------
  // Logout
  // -------------------------
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
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex justify-between items-center h-16 md:h-20">
            
            {/* Logo */}
            <h1
              className="text-3xl md:text-4xl font-bold cursor-pointer"
              onClick={() =>
                userRole === "admin" ? navigate("/admin/dashboard") : navigate("/")
              }
            >
              FOOD<span className="text-green-600">IED</span>
            </h1>

            {/* Navigation Links (only for normal user) */}
            {isLoggedIn && userRole === "user" && (
              <div className="hidden md:flex flex-1 justify-center text-xl space-x-8">
                {navlinks.links.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`font-bold cursor-pointer transition duration-300 ${
                        isActive
                          ? "text-green-600 border-b-2 border-green-600"
                          : "text-black hover:text-green-600"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Right Icons */}
            <div className="hidden md:flex items-center space-x-6 relative">
              {isLoggedIn ? (
                userRole === "user" ? (
                  <>
                    <SearchBar />

                    {/* Cart */}
                    <div className="relative cursor-pointer">
                      <button onClick={() => navigate("/cart")}>
                        <ShoppingBag className="w-8 h-8 text-black" />
                        {cartCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                            {cartCount}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Profile Icon (only first letter) */}
                    <button onClick={() => navigate("/profile")}>
                      <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">
                        {userName
                          ? userName.split(" ")[0].charAt(0).toUpperCase()
                          : "?"}
                      </div>
                    </button>

                    {/* Logout */}
                    <button onClick={handleLogout}>
                      <LogOut className="w-8 h-8 text-black" />
                    </button>
                  </>
                ) : (
                  // Admin Logout
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <LogOut className="w-8 h-8 text-black" />
                    <span className="font-semibold">Logout</span>
                  </button>
                )
              ) : (
                // Not logged in → Login Button
                <button onClick={() => navigate("/login")}>
                  <LogIn className="w-8 h-8 text-black" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* for spacing under fixed nav */}
      <div className="h-24 md:h-28"></div>
    </>
  );
};

export default NavBar;
