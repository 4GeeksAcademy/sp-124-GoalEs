import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "./styles/courses.css"


export const Courses = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  const isAdmin = !!localStorage.getItem("token-admin");
  const isCoach = !!localStorage.getItem("token-coach");

  const handleBack = () => {
    if (localStorage.getItem("token-admin")) navigate("/admin/home");
    else if (localStorage.getItem("token-coach")) navigate("/coach/private");
    else if (localStorage.getItem("token-user")) navigate("/users/home");
    else navigate("/")
  };

  const { store } = useGlobalReducer();
  const token = store.token || localStorage.getItem("token-admin") || localStorage.getItem("token-coach");

  const fetchCourses = async () => {
    try {
      setError("");
      const res = await fetch(`${BACKEND_URL}/course`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error fetching courses");

      const data = await res.json();
      setCourses(data.courses ?? []);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const deleteCourse = async (id) => {
    try {
      const res = await fetch(`${BACKEND_URL}/course/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Error deleting course");

      setCourses(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="courses-layout">

      <div className="courses-container">

        <div className="courses-header">

          <h1 className="courses-title">
            Courses
          </h1>

          <div className="courses-header-actions">
            {isCoach &&
              <button
                className="course-primary-btn"
                onClick={() => navigate("/courses/new")}
              >
                Create Course
              </button>
            }

            {isCoach &&
              <button
                className="course-secondary-btn"
                onClick={handleBack}
                type="button"
              >
                Back to Dashboard
              </button>
            }

          </div>

        </div>

        <div className="courses-grid">

          {courses.map(course => (
            <div key={course.id} className="course-card">

              <div className="course-image-wrapper">
                <img
                  src={course.image_url || "https://picsum.photos/400/200"}
                  alt="course"
                  className="course-image"
                />
              </div>

              <div className="course-card-content">

                <h3 className="course-title">
                  {course.title}
                </h3>

                <p className="course-price">
                  € {course.cost}
                </p>

                <p className="course-meta">
                  Category: {course.category?.name || "—"}
                </p>

                <p className="course-meta">
                  Tags: {course.tags?.map(t => t.name).join(", ") || "—"}
                </p>

                <div className="course-card-actions">

                  <button
                    className="course-outline-btn"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    View
                  </button>

                  {isAdmin && (
                    <button
                      className="course-edit-btn"
                      onClick={() => navigate(`/courses/${course.id}/edit`)}
                    >
                      Edit
                    </button>
                  )}

                  {isAdmin && (
                    <button
                      className="course-delete-btn"
                      onClick={() => deleteCourse(course.id)}
                    >
                      Delete
                    </button>
                  )}

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

