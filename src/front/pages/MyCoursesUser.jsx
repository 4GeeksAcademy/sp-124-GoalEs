import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const MyCoursesUser = () => {

    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    const [myCourses, setMyCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadMyCourses = async () => {
        try {
            const res = await fetch(`${backendURL}/user_course`);

            if (!res.ok) throw new Error("Cannot load user courses");

            const data = await res.json();

            const userCourses = data.user_courses.filter(
                usercourse => usercourse.user_id === store.user.id
            );

            const coursesWithInfo = await Promise.all(
                userCourses.map(async (usercourse) => {
                    const resCourse = await fetch(`${backendURL}/course/${usercourse.course_id}`);
                    const dataCourse = await resCourse.json();

                    return {
                        userCourseId: usercourse.id,
                        ...dataCourse.course
                    };
                })
            );

            setMyCourses(coursesWithInfo);
            
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const removeCourse = async (userCourseId) => {
        try {
            const res = await fetch(`${backendURL}/user_course/${userCourseId}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error("Error removing course");

            setMyCourses(prev =>
                prev.filter(course => course.userCourseId !== userCourseId)
            );

            loadMyCourses();

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadMyCourses();
    }, []);

    if (loading) return <div className="container py-4">Loading...</div>;

    return (
        <div className="container py-4">
            <h1 className="mb-4">My Courses</h1>

            {myCourses.length === 0 && (
                <p className="text-muted">You are not enrolled in any course.</p>
            )}

            <div className="row">
                {myCourses.map(course => (
                    <div key={course.userCourseId} className="col-md-4 mb-4">
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
                                <p className="text-muted mb-1"> Tags: {course.tags?.map(t => t.name).join(", ") || "—"} </p>
                                
                                <div className="mt-auto">
                                    <button
                                        className="btn btn-danger w-100"
                                        onClick={() => removeCourse(course.userCourseId)}
                                    >
                                        Leave Course
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
