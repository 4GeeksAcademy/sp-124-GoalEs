import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/userCoursesAdmin.css"


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
  <div className="user-courses-layout">

    <div className="user-courses-container">

      <div className="user-courses-header">
        <h1 className="user-courses-title">
          User Courses
        </h1>

        <button
          className="user-courses-secondary-btn"
          onClick={() => navigate("/users")}
        >
          Back to Users
        </button>
      </div>

      {userCourses.length === 0 ? (

        <div className="user-courses-empty">
          This user has no courses assigned
        </div>

      ) : (

        <div className="user-courses-grid">

          {userCourses.map(userCourse => {

            const course = coursesById[userCourse.course_id];

            return (
              <div key={userCourse.id} className="user-courses-card">

                <div className="user-courses-image-wrapper">
                  <img
                    src={course?.image_url || "https://picsum.photos/400/200"}
                    alt={course?.title || "course"}
                    className="user-courses-image"
                  />
                </div>

                <div className="user-courses-content">

                  <h3 className="user-courses-name">
                    {course?.title || `Course #${userCourse.course_id}`}
                  </h3>

                  <p className="user-courses-description">
                    {course?.description || "Loading course details..."}
                  </p>

                  <div className="user-courses-meta">
                    <span className={`user-courses-status ${userCourse.active ? "active" : "inactive"}`}>
                      {userCourse.active ? "Active" : "Inactive"}
                    </span>

                    <span className="user-courses-category">
                      {course?.category?.name || "—"}
                    </span>
                  </div>

                  <p className="user-courses-tags">
                    {course?.tags?.map(t => t.name).join(", ") || "—"}
                  </p>

                  <button
                    className="user-courses-delete-btn"
                    onClick={() => deleteUserCourse(userCourse.id)}
                  >
                    Remove Course
                  </button>

                </div>

              </div>
            );

          })}

        </div>

      )}

    </div>

  </div>
);
};

export default UserCourses;
