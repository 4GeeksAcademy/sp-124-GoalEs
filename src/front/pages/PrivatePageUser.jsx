import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const PrivateUser = () => {

    const backendURL = import.meta.env.VITE_BACKEND_URL

    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const token = store.token || localStorage.getItem("token-user");
    const isUnauthorized = !store.isAuthenticated;

    useEffect(() => {
        if (isUnauthorized) {
            const timer = setTimeout(() => {
                navigate("/users/login");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isUnauthorized, navigate]);

    const logout = () => {
        dispatch({ type: "logout-user" });
        localStorage.removeItem("token-user");
        localStorage.removeItem("user");
        navigate("/users/login");
    };

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
            <p>Welcome {store.user?.name}</p>
            <button className="btn btn-secondary" onClick={() => navigate("/")}>Back to home</button>
            <button className="btn btn-outline-secondary" onClick={() => logout()}>logout</button>
        </div>
    );
};