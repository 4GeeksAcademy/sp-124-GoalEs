import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/userCoursesSelectedByAdmin.css"


export const UserCourseSelect = () => {

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const navigate = useNavigate();
    const { userId } = useParams();

    const [courses, setCourses] = useState([]);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token-user") || localStorage.getItem("token-admin");

    const course = async () => {
        try {
            setError("");
            const response = await fetch(`${BACKEND_URL}/course`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Error fetching courses");

            const data = await response.json();
            setCourses(data.courses);
        } catch (error) {
            setError(error.message);
        }
    };

    const addCourseToUser = async (courseId) => {
        try {
            const response = await fetch(`${BACKEND_URL}/user_course`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    active: true,
                    course_id: courseId,
                    user_id: Number(userId)
                })
            });

            navigate("/users")

            if (!response.ok) throw new Error("Error assigning course");
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        course();
    }, []);

    return (
        <div className="assign-course-layout">

            <div className="assign-course-container">

                <div className="assign-course-header">

                    <h1 className="assign-course-title">
                        Select Courses
                    </h1>

                    <button
                        className="assign-course-secondary-btn"
                        onClick={() => navigate("/users")}
                    >
                        Back to Users
                    </button>

                </div>

                {courses.length === 0 ? (
                    <div className="assign-course-empty">
                        No courses available
                    </div>
                ) : (
                    <div className="assign-course-grid">

                        {courses.map(course => (

                            <div key={course.id} className="assign-course-card">

                                <div className="assign-course-image-wrapper">
                                    <img
                                        src={course?.image_url || "https://picsum.photos/400/200"}
                                        alt={course?.title || "course"}
                                        className="assign-course-image"
                                    />
                                </div>

                                <div className="assign-course-content">

                                    <h3 className="assign-course-name">
                                        {course.title}
                                    </h3>

                                    <p className="assign-course-description">
                                        {course.description}
                                    </p>

                                    <div className="assign-course-meta">
                                        <span className="assign-course-price">
                                            € {course.cost}
                                        </span>

                                        <span className="assign-course-category">
                                            {course.category?.name || "—"}
                                        </span>
                                    </div>

                                    <p className="assign-course-tags">
                                        {course.tags?.map(t => t.name).join(", ") || "—"}
                                    </p>

                                    <button
                                        className="assign-course-btn"
                                        onClick={() => addCourseToUser(course.id)}
                                    >
                                        Assign Course
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>
                )}

            </div>

        </div>
    );
};

export default UserCourseSelect;
