import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { StripeWrapper } from "../hooks/StripeWrapper"
import "./styles/availablecoursesUser.css"

export const AvailableCoursesUser = () => {

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const { store } = useGlobalReducer();

    const [courses, setCourses] = useState([])
    const [selectedCourse, setSelectedCourse] = useState(null);

    const token = store.token || localStorage.getItem("token-user") || localStorage.getItem("token-admin");

    const getCourses = async () => {
        try {
            const res = await fetch(`${backendURL}/course`)

            if (!res.ok) throw new Error("We can not get the courses")

            const data = await res.json();

            setCourses(data.courses)

        } catch (err) {
            console.error(err);
        }
    }

    console.log(store.user)

    const addFavorite = async (courseId) => {
        try {
            const res = await fetch(
                `${backendURL}/users/${store.user.id}/favorites/${courseId}`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Error adding favorite");
                return;
            }

            alert("Added to favorites");
        } catch (err) {
            console.error(err);
        }
    };

    const addCourse = async (courseId) => {
        try {
            const res = await fetch(`${backendURL}/user_course`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    active: true,
                    course_id: courseId,
                    user_id: store.user.id
                })
            });

            const data = await res.json();

            if (!res.ok) throw new Error("Something was wrong")

            alert("Course started successfully!");

        } catch (err) {
            console.error(err);
        }
    };


    useEffect(() => {
        getCourses();
    }, [])

    useEffect(() => {
        getCourses();
    }, [])

    return (
        <div className="courses-layout">
            <div className="courses-container">

                <h1 className="courses-title">Available Courses</h1>

                <div className="courses-grid">

                    {courses.map(course => (
                        <div key={course.id} className="course-card">

                            <img
                                src={course.image_url || "https://picsum.photos/400/200"}
                                className="course-image"
                                alt="course"
                            />

                            <div className="course-content">

                                <h5 className="course-title">
                                    {course.title}
                                </h5>

                                <p className="course-description">
                                    {course.description}
                                </p>

                                <p className="course-price">
                                    ${course.cost}
                                </p>

                                <p className="course-meta">
                                    Category: {course.category?.name || "—"}
                                </p>

                                <p className="course-meta">
                                    Tags: {course.tags?.map(t => t.name).join(", ") || "—"}
                                </p>

                                <div className="course-actions">
                                    <button
                                        className="course-btn-outline"
                                        onClick={() => addFavorite(course.id)}
                                    >
                                        Add to Favorites
                                    </button>

                                    <button
                                        className="course-btn-primary"
                                        onClick={() => setSelectedCourse(course)}
                                    >
                                        Start
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}

                </div>

                {selectedCourse && (
                    <div className="course-payment-section">
                        <StripeWrapper course={selectedCourse} />
                    </div>
                )}

            </div>
        </div>
    );
}