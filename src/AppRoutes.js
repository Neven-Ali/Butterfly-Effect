import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import Favorites from "./pages/dashboard/drawer/Favorites";
import Images from "./pages/dashboard/drawer/Images";
import Products from "./pages/dashboard/drawer/products/Products";
import Requests from "./pages/dashboard/drawer/Requests";
import Contact from "./pages/dashboard/drawer/Contact";
import About from "./pages/dashboard/drawer/About";
import EditProduct from "./pages/dashboard/drawer/products/EditProduct";
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
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="images" element={<Images />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<EditProduct />} />   
        <Route path="products/new" element={<EditProduct />} />     
        <Route path="requests" element={<Requests />} />
        <Route path="home" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
