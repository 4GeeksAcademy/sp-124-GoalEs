import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
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
      <h1>Admin's Dashboard</h1>
      <p>Welcome {store.user?.name}{" "}{store.user?.last_name}</p>
      <button className="btn btn-danger" onClick={() => navigate("/")}>Logout</button>
      <button className="btn btn-primary ms-3" onClick={() => navigate ("/users")}>Go to Users</button> 
			<button className="btn btn-primary ms-3" onClick={() => navigate("/coaches")}>Go to Coaches</button>
			<button className="btn btn-primary ms-3" onClick={() => navigate ("/messages")}>Go to Message</button>
			<button className="btn btn-primary ms-3" onClick={() => navigate("/courses")}>Go to courses</button>
    </div>
  );
};