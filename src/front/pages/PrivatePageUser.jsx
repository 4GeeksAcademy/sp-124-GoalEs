import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { AvailableCoursesUser } from "./AvailableCoursesUser";
import { CoursesFavoritesUser } from "./CoursesFavoritesUser";
import { MyCoursesUser } from "./MyCoursesUser";

export const PrivateUser = () => {

    const backendURL = import.meta.env.VITE_BACKEND_URL

    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [goodbye, setGoodBye] = useState(false);

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

        setGoodBye(true)

        setTimeout(() => {
            dispatch({ type: "logout-user" });
            localStorage.removeItem("token-user");
            localStorage.removeItem("user");
            navigate("/users/login");
        }, 3000)
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
            {goodbye && <div className="alert alert-success">We hope to see you back soon!</div>}
            <h1>{store.user?.name} Dashboard</h1>
            <p>Welcome {store.user?.name}</p>
            <AvailableCoursesUser />
            <CoursesFavoritesUser />
            <MyCoursesUser />
            <button className="btn btn-secondary me-2" onClick={() => navigate("/")}>Back to home</button>
            <button className="btn btn-outline-secondary" onClick={() => logout()}>logout</button>
        </div>
    );
};