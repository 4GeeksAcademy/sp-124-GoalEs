// src/front/pages/Layouts/UserLayout.jsx
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function UserLayout() {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const tokenUser = localStorage.getItem("token-user");
    const tokenAdmin = localStorage.getItem("token-admin");
    setAllowed(!!(tokenUser || tokenAdmin));
  }, []);

  if (allowed === null) return null;
  if (!allowed) return <Navigate to="/users/login" replace />;

  return <Outlet />;
}