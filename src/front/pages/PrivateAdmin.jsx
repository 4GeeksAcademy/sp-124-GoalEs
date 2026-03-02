import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "./styles/dashboardadmin.css"
import User from "./User";
import { Coaches } from "./Coaches";
import { Courses } from "./Courses";
import Message from "./Message";
import UserCourseFavorite from "./UserFavorites";
import { Categories } from "./Categories";
import { Tags } from "./Tags";
import { AdminAppointments } from "./AdminAppointments";

export const PrivateAdmin = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const isUnauthorized = !store.isAuthenticated || store.role !== "Admin";
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (isUnauthorized) {
      localStorage.removeItem("token-admin")
      const t = setTimeout(() =>
        navigate("/admin/login")
      , 800);
  return () => clearTimeout(t);
}
  }, [isUnauthorized, navigate]);

const handleLogout = () => {
  localStorage.removeItem("token-admin");
  dispatch({ type: "logout_admin" });
  navigate("/");
};

if (isUnauthorized) {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="alert alert-danger text-center shadow-sm">
            You can not enter this page. Redirecting...
          </div>
        </div>
      </div>
    </div>
  );
}

return (
  <div className="admin-layout">
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Admin</h2>
        <h2 className="sidebar-title">Dashboard</h2>
      </div>

      <nav className="sidebar-nav">
        <button className="sidebar-btn" onClick={() => setActiveSection("appointments")}>
          Appointments
        </button>

        <button className="sidebar-btn" onClick={() => setActiveSection("favorites")}>
          User Favorites
        </button>

        <button className="sidebar-btn" onClick={() => setActiveSection("categories")}>
          Categories
        </button>

        <button className="sidebar-btn" onClick={() => setActiveSection("tags")}>
          Tags
        </button>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-btn secondary" onClick={() => navigate("/")}>
          Back Home
        </button>

        <button className="sidebar-btn danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>

    <main className="admin-main">
      <div className="admin-card">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">
              Welcome {store.user?.name} {store.user?.last_name}
            </h1>
            <p className="admin-subtitle">
              Select a main section to manage core resources
            </p>
          </div>
        </div>

        <div className="admin-primary-actions">
          <button
            className="primary-action-btn"
            onClick={() => navigate("/users")}
          >
            Users
          </button>

          <button
            className="primary-action-btn"
            onClick={() => navigate("/coaches")}
          >
            Coaches
          </button>

          <button
            className="primary-action-btn"
            onClick={() => navigate("/courses")}
          >
            Courses
          </button>
        </div>
      </div>

      {activeSection === "users" && <User />}
      {activeSection === "coaches" && <Coaches />}
      {activeSection === "appointments" && <AdminAppointments />}
      {activeSection === "courses" && <Courses />}
      {activeSection === "favorites" && <UserCourseFavorite />}
      {activeSection === "categories" && <Categories />}
      {activeSection === "tags" && <Tags />}
    </main>
  </div>
);
};