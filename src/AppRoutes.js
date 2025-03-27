import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import ForgetPassword from "./Pages/ForgetPassword";
import ResetPassword from "./Pages/ResetPassword";
import Dashboard from "./Pages/Dashboard";
import Favorites from "./drawer/Favorites";
import Images from "./drawer/Images";
import Products from "./drawer/Products";
import Requests from "./drawer/Requests";
// import ThemeWrapper from "./ThemeWrapper";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { LanguageProvider } from "./contexts/LanguageContext";
import Layout from "./components/Layout";
const AppRoutes = () => {
  return (
    // {/* الصفحات التي لا تحتاج Layout */}
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgetPassword" element={<ForgetPassword />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route path="/register" element={<Register />} />
      {/* الصفحات التي تحتاج Layout */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/images" element={<Images />} />
        <Route path="/products" element={<Products />} />
        <Route path="/requests" element={<Requests />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
