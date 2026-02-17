import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export default function UserGuard({ children }) {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const token = localStorage.getItem("token-user");
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  useEffect(() => {
    if (!store.isAuthenticated && token) {
      dispatch({
        type: "login-user", // ✅ FIXED (matches reducer)
        payload: { token, user }, // ✅ restore user too
      });
    }
  }, [store.isAuthenticated, token, userRaw, dispatch]);

  const isUnauthorized = !token;

  useEffect(() => {
    if (isUnauthorized) navigate("/users/login");
  }, [isUnauthorized, navigate]);

  if (isUnauthorized) return null;

  return children;
}