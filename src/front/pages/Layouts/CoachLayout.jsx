// src/front/pages/Layouts/CoachLayout.jsx
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function CoachLayout() {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const tokenCoach = localStorage.getItem("token-coach");
    const tokenAdmin = localStorage.getItem("token-admin"); // اگر admin هم دسترسی داشته باشد
    setAllowed(!!(tokenCoach || tokenAdmin));
  }, []);

  if (allowed === null) return null; // یا Loading...
  if (!allowed) return <Navigate to="/coaches/login" replace />;

   return <Outlet context={{ base: "/coaches" }} />;
}