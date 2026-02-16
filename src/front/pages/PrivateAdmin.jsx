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
    // 1) clear token
    localStorage.removeItem("token-admin"); // use the same key which we used in LoginAdmin

    // 2) update global store
    dispatch({ type: "logout_admin" });

    // 3) go to login (or home)
    navigate("/admin/login");
  };

  if (isUnauthorized) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">You can not enter this page</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1 className="mb-1">Admin Dashboard</h1>
          <p className="mb-0">
            Welcome {store.user?.name} {store.user?.last_name}
          </p>
        </div>

        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>

      <div className="row g-3 mt-2">
        <div className="col-12 col-md-6 col-lg-3">
          <button className="btn btn-primary ms-3" onClick={() => navigate("/admin/users")}>Go to Users</button>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <button className="btn btn-primary ms-3" onClick={() => navigate("/admin/coaches")}>Go to Coaches</button>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <button className="btn btn-primary ms-3" onClick={() => navigate("/admin/courses")}>Go to courses</button>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <button className="btn btn-primary ms-3" onClick={() => navigate("/admin/messages")}>Go to Message</button>
        </div>
      </div>
    </div>
  );
};