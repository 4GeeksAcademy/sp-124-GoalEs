import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const PrivateAdmin = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const isUnauthorized = !store.isAuthenticated || store.role !== "Admin";

  useEffect(() => {
    if (isUnauthorized) {
      const t = setTimeout(() => navigate("/admin/login"), 800);
      return () => clearTimeout(t);
    }
  }, [isUnauthorized, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token-admin");
    dispatch({ type: "logout_admin" });
    navigate("/admin/login");
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
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h1 className="h4 mb-1">Admin Dashboard</h1>
              <p className="mb-0 text-muted">
                Welcome {store.user?.name} {store.user?.last_name}
              </p>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>
                Back Home
              </button>
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          <hr className="my-4" />

          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-4">
              <button className="btn btn-primary w-100" onClick={() => navigate("/users")}>
                Users
              </button>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <button className="btn btn-primary w-100" onClick={() => navigate("/coaches")}>
                Coaches
              </button>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <button className="btn btn-primary w-100" onClick={() => navigate("/courses")}>
                Courses
              </button>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <button className="btn btn-primary w-100" onClick={() => navigate("/messages")}>
                Messages
              </button>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <button className="btn btn-primary w-100" onClick={() => navigate("/UserCourseFavorite")}>
                User Favorites
              </button>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <button className="btn btn-primary w-100" onClick={() => navigate("/admin/categories")}>
                Categories
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};