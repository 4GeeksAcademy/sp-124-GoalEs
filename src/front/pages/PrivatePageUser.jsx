import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const PrivateUser = () => {

    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    const isUnauthorized = !store.isAuthenticated || store.role !== "User";

    useEffect(() => {
        if (isUnauthorized) {
            const timer = setTimeout(() => {
                navigate("/users/login");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isUnauthorized, navigate]);

    if (isUnauthorized) {
        return (
            <div className="container py-4">
                <div className="alert alert-danger" role="alert">
                    You can not enter this page
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <h1>User Dashboard</h1>
            <p>Welcome {store.user.name}</p>
            <button className="btn btn-secondary" onClick={() => navigate("/")}>Back to home</button>
            <button className="btn btn-outline-secondary" onClick={() => navigate("/users/login")}>Back to login</button>
        </div>
    );
};