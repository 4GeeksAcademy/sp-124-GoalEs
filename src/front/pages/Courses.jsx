import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export const Courses = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();
  
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    try {
      setError("");
      const res = await fetch(`${BACKEND_URL}/course`);
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
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Error deleting course");

      setCourses(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-4">
        <h1>Courses</h1>

        <div className="d-flex gap-2">
          <button className="btn btn-primary mt-3" onClick={() => navigate("/courses/new")}>
            Create Course
          </button>
          <button className="btn btn-secondary mt-3" onClick={() => navigate("/")}>
            Back Home
          </button>
        </div>
      </div>

      <div className="row">
        {courses.map(course => (
          <div key={course.id} className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5>{course.title}</h5>
                <p className="text-muted">{course.description}</p>
                <p><strong>€ {course.cost}</strong></p>

                <div className="mt-auto d-flex gap-2">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    View
                  </button>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/courses/${course.id}/edit`)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteCourse(course.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

