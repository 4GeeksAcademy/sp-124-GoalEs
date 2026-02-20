// src/front/pages/Layouts/PublicLayout.jsx
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null; // یا Loading...
  return <Outlet />;
}