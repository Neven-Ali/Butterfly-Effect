import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
const Layout = () => {
  return (
    <div>
      <Navbar />
      {/* <main style={{ padding: "20px", border: "1px solid red" }}> */}
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
