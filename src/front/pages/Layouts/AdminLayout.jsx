// src/front/pages/Layouts/AdminLayout.jsx
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const tokenAdmin = localStorage.getItem("token-admin");
    setAllowed(!!tokenAdmin);
  }, []);

  if (allowed === null) return null; // یا Loading...
  if (!allowed) return <Navigate to="/admin/login" replace />;

   return <Outlet context={{ base: "/admin" }} />;
}