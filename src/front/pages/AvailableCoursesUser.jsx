import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { StripeWrapper } from "../hooks/StripeWrapper"

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
                { method: "POST",
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
        <>
            <div className="container py-4">
                <h1 className="mb-4">Available Courses</h1>

                <div className="row">
                    {courses.map(course => (
                        <div key={course.id} className="col-md-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                <img
                                    src={course.image_url || "https://picsum.photos/400/200"}
                                    className="card-img-top"
                                    alt="course"
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{course.title}</h5>
                                    <p className="card-text">{course.description}</p>
                                    <p className="fw-bold">${course.cost}</p>
                                    <p className="text-muted mb-1"> Category: {course.category?.name || "—"} </p>
                                    <div className="mt-auto d-flex gap-2">
                                        <button className="btn btn-outline-primary w-100" onClick={() => addFavorite(course.id)}>Add to Favorites</button>
                                        <button
                                            className="btn btn-success w-100"
                                            onClick={() => setSelectedCourse(course)}>Start</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {selectedCourse && (
                        <div className="mt-4">
                            <StripeWrapper course={selectedCourse} />
                        </div>
                    )}
                </div>
            </div>

        </>
    )
}