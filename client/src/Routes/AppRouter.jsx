import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Components
import NavBar from "../NavBar";
import Footer from "../Footer";
import AdminNavbar from "../components/admin/AdminNavbar";

// User Pages
import Home from "../pages/user/HomePage";
import About from "../pages/user/AboutPage";
import Menu from "../pages/user/MenuPage";
import Contact from "../pages/user/ContactPage";
import OrderSection from "../components/user/menu/OrderSection";
import SearchPage from "../pages/user/SearchPage";
import CartPage from "../pages/user/CartPage";
import ProfilePage from "../pages/user/ProfilePage";
import CheckoutSection from "../components/user/menu/CheckOutSection";
import OrderPage from "../pages/user/OrderPage";
import OrderConfirm from "../components/user/menu/OrderConfirm";
import OrderDetails from "../components/user/orders/OrderDetails";
import ItemRatings from "../components/user/menu/ItemRatings";

// Auth Pages
import SigninPage from "../pages/auth/SigninPage";
import LoginPage from "../pages/auth/LoginPage";

// Admin Pages
import DashboardPage from "../pages/admin/DashBoardPage";
import OrdersPage from "../pages/admin/OrdersPage";
import UsersPage from "../pages/admin/UsersPage";
import MessagesPage from "../pages/admin/MessagePage";
import MenuPage from "../pages/admin/MenuPage";
import OrderView from "../components/admin/Orders/OrderView";
import AdminPeople from "../components/admin/people/AdminPeople";
import AdminRatings from "../components/admin/ratings/AdminRatings";

// =================== USER LAYOUT ===================
const UserLayout = () => (
  <div className="flex flex-col min-h-screen">
    <NavBar />
    <main className="flex-1">
      <Routes>
        <Route path="/" element={<ProtectedRoute role="user"><Home /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute role="user"><About /></ProtectedRoute>} />
        <Route path="/menu" element={<ProtectedRoute role="user"><Menu /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute role="user"><Contact /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute role="user"><CheckoutSection /></ProtectedRoute>} />
        <Route path="/searchpage" element={<ProtectedRoute role="user"><SearchPage /></ProtectedRoute>} />
        <Route path="/cartpage" element={<ProtectedRoute role="user"><CartPage /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute role="user"><OrderSection /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute role="user"><OrderPage /></ProtectedRoute>} />
        <Route path="/order-details/:id" element={<ProtectedRoute role="user"><OrderDetails /></ProtectedRoute>} />
        <Route path="/itemratings/:orderId" element={<ProtectedRoute role="user"><ItemRatings /></ProtectedRoute>} />
        <Route path="/order-confirm/:orderId" element={<ProtectedRoute role="user"><OrderConfirm /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute role="user"><ProfilePage /></ProtectedRoute>} />
      </Routes>
    </main>
    <Footer />
  </div>
);

// =================== ADMIN LAYOUT ===================
const AdminLayout = () => (
  <div className="flex min-h-screen">
    <AdminNavbar />
    <main className="ml-64 flex-1 bg-gray-50 h-screen overflow-y-auto p-6">
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ProtectedRoute role="admin"><DashboardPage /></ProtectedRoute>} />
        <Route path="menu" element={<ProtectedRoute role="admin"><MenuPage /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute role="admin"><OrdersPage /></ProtectedRoute>} />
        <Route path="orders/:id" element={<ProtectedRoute role="admin"><OrderView /></ProtectedRoute>} />
        <Route path="users" element={<ProtectedRoute role="admin"><UsersPage /></ProtectedRoute>} />
        <Route path="messages" element={<ProtectedRoute role="admin"><MessagesPage /></ProtectedRoute>} />
        <Route path="people" element={<ProtectedRoute role="admin"><AdminPeople /></ProtectedRoute>} />
        <Route path="ratings" element={<ProtectedRoute role="admin"><AdminRatings /></ProtectedRoute>} />
      </Routes>
    </main>
  </div>
);

// =================== APP ROUTER ===================
const AppRouter = () => (
  <Router>
    <Routes>
      {/* AUTH */}
      <Route path="/signup" element={<SigninPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* ADMIN */}
      <Route path="/admin/*" element={<AdminLayout />} />

      {/* USER */}
      <Route path="/*" element={<UserLayout />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Router>
);

export default AppRouter;
