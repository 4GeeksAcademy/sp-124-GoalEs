import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");

  const fetchCourse = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/course/${id}`);
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
    <div className="container py-4">
      <h1>{course.title}</h1>

      <div className="card shadow-sm">
        <div className="card-body">
          <p><strong>Description:</strong> {course.description}</p>
          <p><strong>Cost:</strong> € {course.cost}</p>
        </div>
      </div>

      <div className="mt-4 d-flex gap-2">
        <button className="btn btn-secondary" onClick={() => navigate("/courses")}>
          Back to Courses
        </button>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>
          Home
        </button>
      </div>
    </div>
  );
};

export default CourseDetail;