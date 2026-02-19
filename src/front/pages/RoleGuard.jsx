import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { jwtDecode } from "jwt-decode";

function homeByRole(role) {
  if (role === "admin") return "/admin/home";
  if (role === "coach") return "/coach/private";
  if (role === "user") return "/users/home";
  return "/";
}

function pickTokenByRoles(roles) {
  // added by arash: return the first EXISTING token that matches roles (handles ["coach","admin"] correctly)
  const map = {
    admin: "token-admin",
    coach: "token-coach",
    user: "token-user",
  };

  // added by arash
  for (const r of roles) {
    const t = localStorage.getItem(map[r]);
    if (t) return t;
  }

  // fallback: any token
  return (
    localStorage.getItem("token-admin") ||
    localStorage.getItem("token-coach") ||
    localStorage.getItem("token-user") ||
    null
  );
}

export default function RoleGuard({ roles = [], children }) {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const location = useLocation();

  const token = useMemo(() => pickTokenByRoles(roles), [roles]);

  const decoded = useMemo(() => {
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }, [token]);

  const tokenRole = decoded?.role ?? null;

  useEffect(() => {
    if (!store.isAuthenticated && token && decoded && tokenRole) {
      const id = decoded.sub ?? decoded.identity ?? null;

      if (tokenRole === "admin") {
        dispatch({
          type: "login_admin",
          payload: { token, role: "Admin", user: id ? { id } : null },
        });
      }

      if (tokenRole === "coach") {
        dispatch({
          type: "login-coach",
          payload: { token, coach: id ? { id } : null },
        });
      }

      if (tokenRole === "user") {
        dispatch({
          type: "login-user",
          payload: { token, user: id ? { id } : null },
        });
      }
    }

    if (token && !decoded) {
      localStorage.removeItem("token-admin");
      localStorage.removeItem("token-coach");
      localStorage.removeItem("token-user");
    }
  }, [store.isAuthenticated, token, decoded, tokenRole, dispatch]);

  const isUnauthorized = !token || !tokenRole || !roles.includes(tokenRole);

  useEffect(() => {
    if (isUnauthorized) {
      const target = homeByRole(tokenRole);
      const t = setTimeout(() => {
        if (location.pathname === target) navigate("/", { replace: true });
        else navigate(target, { replace: true });
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [isUnauthorized, tokenRole, navigate, location.pathname]);

  if (isUnauthorized) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">
          You can not enter this page. Redirecting to home...
        </div>
      </div>
    );
  }

  return children;
}