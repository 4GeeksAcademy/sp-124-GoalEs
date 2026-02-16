import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { jwtDecode } from "jwt-decode";

export default function AdminGuard({ children }) {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const token = localStorage.getItem("token-admin");

  // restore session if page refresh and token exists
  useEffect(() => {
    if (!store.isAuthenticated && token) {
      try {
        const decoded = jwtDecode(token);

        // common JWT patterns: sub / identity
        const adminId = decoded.sub ?? decoded.identity ?? null;

        dispatch({
          type: "login_admin",
          payload: {
            token,
            role: "Admin",
            user: adminId ? { id: adminId } : null,
          },
        });
      } catch (e) {
        // bad token -> clear it
        localStorage.removeItem("token-admin");
      }
    }
  }, [store.isAuthenticated, token, dispatch]);

  const isUnauthorized = !token || store.role !== "Admin";

  // show message then redirect after 3 seconds
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