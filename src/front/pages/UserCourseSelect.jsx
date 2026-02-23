import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


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
        <div className="container py-4">
            <div className="d-flex justify-content-between mb-4">
                
                <h1>Select courses</h1>

                <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/users")} 
                >
                    Back to users
                </button>
            </div>
            <div className="row">
                {courses.length === 0 ? (
                    <h2>No courses available</h2>
                ) : (
                    courses.map(course => (
                        <div key={course.id} className="col-md-4 mb-3">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body d-flex flex-column">
                                    <img
                                        src={course?.image_url || "https://picsum.photos/400/200"}
                                        class="img-thumbnail"
                                        alt={course?.title || "course"}
                                        style={{ height: "25rem", objectFit: "contain" }}
                                        />

                                    <h5>{course.title}</h5>
                                    <p className="text-muted">{course.description}</p>
                                    <p><strong>€ {course.cost}</strong></p>
                                    <p className="text-muted mb-1"> Category: {course.category?.name || "—"} </p>
                                    <p className="text-muted mb-1"> Tags: {course.tags?.map(t => t.name).join(", ") || "—"} </p>

                                    <div className="mt-auto">
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => addCourseToUser(course.id)}
                                        >
                                            Assign course
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UserCourseSelect;
