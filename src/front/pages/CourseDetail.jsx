import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "./styles/courses.css"

export const CourseDetail = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const { id } = useParams();
  const navigate = useNavigate();

  const isAdmin = !!localStorage.getItem("token-admin");

  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");

  const { store } = useGlobalReducer();
  const token = store.token || localStorage.getItem("token-user") || localStorage.getItem("token-admin") || localStorage.getItem("token-coach");

  const fetchCourse = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error loading course");

      const data = await res.json();
      setCourse(data.course ?? data);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  if (error) return <div className="text-danger">{error}</div>;
  if (!course) return <p>Loading...</p>;


  return (
    <div className="course-detail-layout">

      <div className="course-detail-container">

        <h1 className="course-detail-title">
          {course.title}
        </h1>

        <div className="course-detail-card">

          <div className="course-detail-image-wrapper">
            <img
              src={course.image_url || "https://picsum.photos/800/350"}
              alt="course"
              className="course-detail-image"
            />
          </div>

          <div className="course-detail-content">

            <div className="course-detail-price">
              € {course.cost}
            </div>

            <p className="course-detail-description">
              {course.description}
            </p>

            <div className="course-detail-meta">
              <p>
                <span className="meta-label">Category:</span>{" "}
                {course.category?.name || "—"}
              </p>

              <p>
                <span className="meta-label">Tags:</span>{" "}
                {course.tags?.map(t => t.name).join(", ") || "—"}
              </p>
            </div>

          </div>

        </div>

        <div className="course-detail-actions">

          <button
            className="course-secondary-btn"
            onClick={() => navigate("/courses")}
          >
            Back to Courses
          </button>
          {isAdmin &&
            <button
              className="course-outline-btn"
              onClick={() => navigate("/admin/home")}
            >
              Back to Admin Dashboard
            </button>
          }

        </div>

      </div>

    </div>
  );
};

