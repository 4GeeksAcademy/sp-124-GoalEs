import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "./styles/myCoursesUser.css"

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

    if (loading) {
  return (
    <div className="mycourses-layout">
      <p className="mycourses-loading">Loading...</p>
    </div>
  );
}

return (
  <div className="mycourses-layout">

    <div className="mycourses-container">

      <h1 className="mycourses-title">
        My Courses
        <span className="mycourses-count">
          ({myCourses.length})
        </span>
      </h1>

      {myCourses.length === 0 && (
        <p className="mycourses-empty">
          You are not enrolled in any course.
        </p>
      )}

      <div className="mycourses-grid">

        {myCourses.map(course => (
          <div key={course.userCourseId} className="mycourse-card">

            <img
              src={course.image_url || "https://picsum.photos/400/200"}
              className="mycourse-image"
              alt="course"
            />

            <div className="mycourse-content">

              <h5 className="mycourse-title">
                {course.title}
              </h5>

              <p className="mycourse-description">
                {course.description}
              </p>

              <p className="mycourse-price">
                ${course.cost}
              </p>

              <p className="mycourse-meta">
                Category: {course.category?.name || "—"}
              </p>

              <p className="mycourse-meta">
                Tags: {course.tags?.map(t => t.name).join(", ") || "—"}
              </p>

              <div className="mycourse-actions">
                <button
                  className="mycourse-leave-btn"
                  onClick={() => removeCourse(course.userCourseId)}
                >
                  Leave Course
                </button>
              </div>

            </div>

          </div>
        ))}

      </div>

    </div>

  </div>
);
};
