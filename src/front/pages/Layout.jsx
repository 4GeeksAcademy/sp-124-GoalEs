import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import "./styles/main.css"

export const Layout = () => {
  return (
    <ScrollToTop>
      <div className="layout-wrapper">
        <Navbar />

        <main className="layout-content">
          <Outlet />
        </main>

        <Footer />
      </div>
    </ScrollToTop>
  );
};