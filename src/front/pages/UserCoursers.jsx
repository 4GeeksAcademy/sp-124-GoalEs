import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


export const UserCourses = () => {

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const navigate = useNavigate();
    const { userId } = useParams();

    const [userCourses, setUserCourses] = useState([]);
    const [error, setError] = useState("");

    // added by arash
    const token = localStorage.getItem("token-user") || localStorage.getItem("token-admin");

    const userCourse = async () => {
        try {
            setError("");
            const response = await fetch(`${BACKEND_URL}/user_course`, {
                headers: { Authorization: `Bearer ${token}` } // added by arash
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
                headers: { Authorization: `Bearer ${token}` } // added by arash
            });

            if (!response.ok) throw new Error("Error deleting user course");

            setUserCourses(prevUserCourses =>
                prevUserCourses.filter(userCourse => userCourse.id !== id)
            );
        } catch (error) {
            setError(error.message);
        }
    };


    useEffect(() => {
        userCourse();
    }, []);

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between mb-4">
                <h1>User Courses</h1>

                <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/users")} // added by arash
                >
                    Back to users
                </button>
            </div>

            <div className="row">
                {userCourses.length === 0 ? (
                    <h2>Este usuario no tiene cursos</h2>
                ) : (
                    userCourses.map(userCourse => (
                        <div key={userCourse.id} className="col-md-4 mb-3">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body d-flex flex-column">
                                    <p>
                                        <strong>Course ID:</strong> {userCourse.course_id}
                                    </p>

                                    <p>
                                        <strong>Status:</strong>{" "}
                                        {userCourse.active ? "Active" : "Inactive"}
                                    </p>

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
                    ))
                )}
            </div>
        </div>
    );
};

export default UserCourses;
