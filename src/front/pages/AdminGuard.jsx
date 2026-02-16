import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export default function AdminGuard({ children }) {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  // read from localStorage
  const tokenAdmin = localStorage.getItem("token-admin");
  const adminRaw = localStorage.getItem("admin");
  const adminFromLS = adminRaw ? JSON.parse(adminRaw) : null;

  // 1) If store is not authenticated but we have token -> restore session
  useEffect(() => {
    if (!store.isAuthenticated && tokenAdmin) {
      dispatch({
        type: "login_admin",
        payload: {
          token: tokenAdmin,
          user: adminFromLS,
          role: "Admin"
        }
      });
    }
  }, [store.isAuthenticated, tokenAdmin, adminRaw, dispatch]); 

  // 2) Decide if unauthorized
  const isUnauthorized =
    !(store.isAuthenticated || tokenAdmin) || store.role !== "Admin";

  // 3) If unauthorized, show message then redirect after a delay, 3 seconds
  useEffect(() => {
    if (isUnauthorized) {
      const t = setTimeout(() => navigate("/admin/login"), 3000);
      return () => clearTimeout(t);
    }
  }, [isUnauthorized, navigate]);

  if (isUnauthorized) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">
          You can not enter this page. Redirecting to Admin Login...
        </div>
      </div>
    );
  }

  return children;
}