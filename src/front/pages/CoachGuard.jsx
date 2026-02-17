import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export default function CoachGuard({ children }) {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const token = localStorage.getItem("token-coach");

  useEffect(() => {
    if (!store.isAuthenticated && token) {
      dispatch({ type: "is-authenticated" }); // you already have this action
    }
  }, [store.isAuthenticated, token, dispatch]);

  const isUnauthorized = !token;

  useEffect(() => {
    if (isUnauthorized) navigate("/coaches/login");
  }, [isUnauthorized, navigate]);

  if (isUnauthorized) return null;

  return children;
}