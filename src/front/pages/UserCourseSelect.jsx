import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


export const UserCourseSelect = () => {

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const navigate = useNavigate();
    const { userId } = useParams();

    const [courses, setCourses] = useState([]);
    const [error, setError] = useState("");

    const course = async () => {
        try {
            setError("");
            const response = await fetch(`${BACKEND_URL}/course`);
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
                    "Content-Type": "application/json"
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
                    onClick={() => navigate(`/users`)}
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
                                    <h5>{course.title}</h5>
                                    <p className="text-muted">{course.description}</p>
                                    <p><strong>€ {course.cost}</strong></p>

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
