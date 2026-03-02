import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { CoachMap } from "./CoachMap";
import "./styles/coaches.css"

export const CoachDetails = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const { store } = useGlobalReducer();

    const [coach, setCoach] = useState();
    const [courses, setCourses] = useState([]);
    const getCoachCourses = async () => {
        try {
            const res = await fetch(`${backendURL}/coach/${id}/courses`);
            const data = await res.json();
            setCourses(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getCoachDetails();
        getCoachCourses();
    }, [id]);

    const getCoachDetails = async () => {
        try {
            const res = await fetch(`${backendURL}/coach/${id}`, {
                headers: { Authorization: `Bearer ${store.token}` }
            })

            if (!res.ok) throw new Error("Coach not found")

            const data = await res.json();

            setCoach(data.coach)
            console.log(data.coach)

        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div className="coach-profile-layout">

            <div className="coach-profile-container">

                {!coach && (
                    <div className="coach-profile-loading">
                        Loading...
                    </div>
                )}

                {coach && (
                    <>
                        {/* ===== HEADER ===== */}
                        <div className="coach-profile-header">

                            <img
                                src={
                                    coach.profile_image ||
                                    `https://ui-avatars.com/api/?name=${coach.name}`
                                }
                                alt="Profile"
                                className="coach-profile-avatar"
                            />

                            <div className="coach-profile-info">
                                <h1 className="coach-profile-name">
                                    {coach.name} {coach.last_name}
                                </h1>

                                <p className="coach-profile-email">
                                    {coach.email}
                                </p>

                                {coach.city && (
                                    <p className="coach-profile-location">
                                        📍 {coach.city}, {coach.province}, {coach.country}
                                    </p>
                                )}
                            </div>

                        </div>

                        

                            {/* ===== MAP ===== */}
                        <div className="coach-profile-section">
                            <h2 className="coach-profile-section-title">
                                Where am I?
                            </h2>

                            <div className="coach-profile-map-wrapper">
                                <CoachMap
                                    latitude={coach.latitude}
                                    longitude={coach.longitude}
                                    name={`${coach.name} ${coach.last_name}`}
                                />
                            </div>
                        </div>
                        {/* ===== COURSES ===== */}
                        <div className="coach-profile-section">
                            <h2 className="coach-profile-section-title">
                                Available Courses
                            </h2>

                            {courses.length === 0 && (
                                <p className="coach-muted">
                                    No courses available.
                                </p>
                            )}

                            <div className="coach-profile-courses-grid">
                                {courses.map(course => (
                                    <div key={course.id} className="coach-profile-course-card">

                                        <img
                                            src={course.image_url || "https://picsum.photos/400/200"}
                                            alt={course.title}
                                            className="coach-profile-course-image"
                                        />

                                        <div className="coach-profile-course-content">
                                            <h4>{course.title}</h4>
                                            <p className="coach-course-desc">
                                                {course.description}
                                            </p>
                                            <p className="coach-course-price">
                                                ${course.cost}
                                            </p>
                                            <p className="coach-muted small">
                                                Category: {course.category?.name || "—"}
                                            </p>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>

                        

                        {/* ===== ACTIONS ===== */}
                        <div className="coach-profile-actions">

                            <button
                                className="coach-secondary-btn"
                                onClick={() => navigate('/coaches')}
                            >
                                Back to Coaches
                            </button>

                            <button
                                className="coach-primary-btn"
                                onClick={() => navigate(`/coaches/${id}/reserve`)}
                            >
                                Reserve
                            </button>

                        </div>

                    </>
                )}

            </div>

        </div>
    );
}