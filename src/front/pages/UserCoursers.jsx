import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


export const UserCourses = () => {

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const navigate = useNavigate();
    const { userId } = useParams();

    const [userCourses, setUserCourses] = useState([]);
    const [error, setError] = useState("");
    const [coursesById, setCoursesById] = useState({});

    const token = localStorage.getItem("token-user") || localStorage.getItem("token-admin");

    const userCourse = async () => {
        try {
            setError("");
            const response = await fetch(`${BACKEND_URL}/user_course`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Error fetching user courses");

            const data = await response.json();

            const filteredUserCourses = data.user_courses.filter(
                userCourse => userCourse.user_id === Number(userId)
            );

            setUserCourses(filteredUserCourses);
        } catch (error) {
            setError(error.message);
        }
    };

    const deleteUserCourse = async (id) => {
        try {
            setError("");

            const response = await fetch(`${BACKEND_URL}/user_course/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Error deleting user course");

            setUserCourses(prevUserCourses =>
                prevUserCourses.filter(userCourse => userCourse.id !== id)
            );
        } catch (error) {
            setError(error.message);
        }
    };

        const fetchCourses = async () => {
    try {
        const res = await fetch(`${BACKEND_URL}/course`);
        const data = await res.json();

        const list = data.courses ?? [];
        const map = {};
        list.forEach(c => { map[c.id] = c; });

        setCoursesById(map);
    } catch (e) {
    }
    };


    useEffect(() => {
        userCourse();
        fetchCourses();
    }, []);

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between mb-4">
                <h1>User Courses</h1>

                <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/users")} 
                >
                    Back to users
                </button>
            </div>

            <div className="row">
                {userCourses.length === 0 ? (
                    <h2>Este usuario no tiene cursos</h2>
                ) : (
                    userCourses.map(userCourse => {
                    const course = coursesById[userCourse.course_id];

                    return (
                        <div key={userCourse.id} className="col-md-4 mb-3">
                        <div className="card h-100 shadow-sm">

                            <img
                            src={course?.image_url || "https://picsum.photos/400/200"}
                            class="img-thumbnail"
                            alt={course?.title || "course"}
                            style={{ height: "25rem", objectFit: "contain" }}
                            />

                            <div className="card-body d-flex flex-column">
                            <h5 className="card-title mb-2">
                                {course?.title || `Course #${userCourse.course_id}`}
                            </h5>

                            <p className="card-text text-muted">
                                {course?.description || "Loading course details..."}
                            </p>

                            <p>
                                <strong>Status:</strong> {userCourse.active ? "Active" : "Inactive"}
                            </p>
                            <p className="text-muted mb-1"> Category: {course.category?.name || "—"} </p>
                            <p className="text-muted mb-1"> Tags: {course.tags?.map(t => t.name).join(", ") || "—"} </p>

                            <div className="mt-auto">
                                <button
                                className="btn btn-danger btn-sm"
                                onClick={() => deleteUserCourse(userCourse.id)}
                                >
                                Remove course
                                </button>
                            </div>
                            </div>
                        </div>
                        </div>
                    );
                    })
                )}
            </div>
        </div>
    );
};

export default UserCourses;
