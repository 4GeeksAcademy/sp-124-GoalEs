import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const PrivateAdmin = () => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  const isUnauthorized = !store.isAuthenticated || store.role !== "Admin";

  useEffect(() => {
    if (isUnauthorized) {
      const t = setTimeout(() => navigate("/admin/login"), 1500);
      return () => clearTimeout(t);
    }
  }, [isUnauthorized, navigate]);

  if (isUnauthorized) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">You can not enter this page</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1>Admin Dashboard</h1>
      <p>Welcome {store.user?.name}</p>
      <button className="btn btn-secondary" onClick={() => navigate("/")}>Back to home</button>
    </div>
  );
};