import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { AvailableCoursesUser } from "./AvailableCoursesUser";
import { CoursesFavoritesUser } from "./CoursesFavoritesUser";
import { MyCoursesUser } from "./MyCoursesUser";
import { NavbarUser } from "./NavbarUser";
import { MyAppointmentsUser } from "./MyAppointmentsUser";
import "./styles/privatePageUser.css"

export const PrivateUser = () => {

    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [goodbye, setGoodBye] = useState(false);
    const [activeSection, setActiveSection] = useState("available");

    const token = store.token || localStorage.getItem("token-user");
    const isUnauthorized = !token;

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
            <div className="user-unauthorized">
                You can not enter this page
            </div>
        );
    }

    return (
        <>

            <div className="user-dashboard-layout">

                <aside className="user-sidebar">

                    <h2 className="user-sidebar-title">User Panel</h2>

                    <button
                        className="user-sidebar-btn"
                        onClick={() => setActiveSection("available")}
                    >
                        Available Courses
                    </button>

                    <button
                        className="user-sidebar-btn"
                        onClick={() => setActiveSection("favorites")}
                    >
                        Favorites
                    </button>

                    <button
                        className="user-sidebar-btn"
                        onClick={() => setActiveSection("mycourses")}
                    >
                        My Courses
                    </button>

                    <button
                        className="user-sidebar-btn"
                        onClick={() => setActiveSection("appointments")}
                    >
                        My Appointments
                    </button>

                    <button
                        className="user-sidebar-btn"
                        onClick={() => navigate("/users/chats")}
                    >
                        Chats
                    </button>

                </aside>

                <main className="user-main-content">

                    <h1 className="user-dashboard-title">Dashboard</h1>

                    {activeSection === "available" && <AvailableCoursesUser />}
                    {activeSection === "favorites" && <CoursesFavoritesUser />}
                    {activeSection === "mycourses" && <MyCoursesUser />}
                    {activeSection === "appointments" && <MyAppointmentsUser />}

                </main>

            </div>
        </>
    );
};