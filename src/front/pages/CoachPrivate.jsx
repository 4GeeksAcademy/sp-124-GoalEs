import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";
import "./styles/privateCoach.css"



export default function CoachPrivate() {
  const { dispatch, store } = useGlobalReducer();
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [coursesError, setCoursesError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentsError, setStudentsError] = useState("");

  const token = localStorage.getItem("token-coach");

  const coachId =
    store?.coach?.id ||
    Number(localStorage.getItem("coach_id")) ||
    null;

  useEffect(() => {
    const restoreCoachId = async () => {
      if (!token) return;
      if (coachId) return;

      try {
        const res = await fetch(`${backendURL}/coach/private`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && data?.coach?.id) {
          localStorage.setItem("coach_id", data.coach.id);
          dispatch({
            type: "login-coach",
            payload: { token, coach: data.coach },
          });
        }
      } catch (e) {
      }
    };

    restoreCoachId();
  }, [token]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      setCoursesError("");

      try {
        if (!coachId) {
          setCoursesError("Missing coach id. Please login again.");
          return;
        }

        const res = await fetch(`${backendURL}/coach/${coachId}/courses-students`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setCoursesError(data.error || "Error to search courses");
          return;
        }

        setCourses(data);
      } catch (e) {
        setCoursesError("Failed to search course");
      } finally {
        setLoadingCourses(false);
      }
    };

    if (token) fetchCourses();
  }, [token, coachId, backendURL]);

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure?")) return;

    const res = await fetch(`${backendURL}/course/${courseId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    } else {
      const data = await res.json();
      alert(data.msg || data.error || "Error to delete");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token-coach");
    localStorage.removeItem("coach");
    localStorage.removeItem("coach_id");
    localStorage.removeItem("role")

    dispatch({ type: "logout-coach" });
    navigate("/");
  };

  const deleteAccount = async () => {
    const confirmation = window.confirm(
      "Are you sure? This action CANNOT be undone and will delete all your courses."
    );
    if (!confirmation) return;

    const finalConfirmation = window.prompt("Type DELETE to confirm:");
    if (finalConfirmation !== "DELETE") {
      alert("Account deletion cancelled");
      return;
    }

    try {
      if (!coachId) {
        alert("Missing coach id. Please login again.");
        return;
      }

      const res = await fetch(`${backendURL}/coach/${coachId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        localStorage.removeItem("token-coach");
        localStorage.removeItem("coach_id");
        dispatch({ type: "logout-coach" });
        alert("Account deleted successfully");
        navigate("/");
      } else {
        const data = await res.json();
        alert(data.error || "Error deleting account");
      }
    } catch (e) {
      alert("Error deleting account");
    }
  };

  const openStudentsModal = async (course) => {
    setSelectedCourse(course);
    setShowModal(true);
    setLoadingStudents(true);
    setStudentsError("");
    setStudents([]);

    try {
      const res = await fetch(`${backendURL}/course/${course.id}/enrolled-students`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Error loading students");

      setStudents(data.students || []);
    } catch (e) {
      setStudentsError(e.message);
    } finally {
      setLoadingStudents(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
    setStudents([]);
    setStudentsError("");
    setLoadingStudents(false);
  };

  return (
    <div className="coach-dashboard-layout">


      <aside className="coach-sidebar">

        <h2 className="coach-sidebar-title">
          Coach Panel
        </h2>

        <nav className="coach-sidebar-nav">

          <button
            className="coach-sidebar-btn"
            onClick={() => navigate("/coach/create-course")}
          >
            + Create Course
          </button>

          <button
            className="coach-sidebar-btn"
            onClick={() => navigate("/coach/chats")}
          >
            Chats
          </button>

          <button
            className="coach-sidebar-btn"
            onClick={() => navigate("/coach/appointments/my")}
          >
            Reservations
          </button>

        </nav>

      </aside>

      <main className="coach-dashboard-main">

        <div className="coach-dashboard-header">
          <h2>
            {store.coach.name} Dashboard
          </h2>
        </div>

        {loadingCourses && <p>Loading...</p>}
        {coursesError && <p className="coach-error">{coursesError}</p>}

        {!loadingCourses && !coursesError && courses.length === 0 && (
          <p className="coach-empty">
            You don't have any courses created yet.
          </p>
        )}

        <div className="coach-courses-grid">

          {courses.map((course) => (
            <div key={course.id} className="coach-course-card">

              <img
                src={course.image_url || "https://picsum.photos/400/200"}
                className="coach-course-image"
                alt="course"
              />

              <div className="coach-course-content">

                <h5 className="coach-course-title">
                  {course.title}
                </h5>

                <p className="coach-course-description">
                  {course.description}
                </p>

                <p className="coach-course-price">
                  ${course.cost}
                </p>

                <p className="coach-course-meta">
                  Category: {course.category?.name || "—"}
                </p>

                <p className="coach-course-meta">
                  Tags: {course.tags?.map(t => t.name).join(", ") || "—"}
                </p>

                <button
                  className="coach-students-btn"
                  onClick={() => openStudentsModal(course)}
                >
                  👥 View {course.enrolled_students} Students
                </button>

                <div className="coach-course-actions">

                  <button
                    className="coach-edit-btn"
                    onClick={() => navigate(`/coach/edit-course/${course.id}`)}
                  >
                    Edit
                  </button>

                  <button
                    className="coach-delete-btn"
                    onClick={() => handleDelete(course.id)}
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
        {showModal && (
          <div
            className="coach-modal-overlay"
            onClick={closeModal}
          >
            <div
              className="coach-modal"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="coach-modal-header">
                <h3>
                  Students — {selectedCourse?.title}
                </h3>
                <button
                  className="coach-modal-close"
                  onClick={closeModal}
                >
                  ✕
                </button>
              </div>

              <div className="coach-modal-body">

                {loadingStudents ? (
                  <p>Loading...</p>
                ) : studentsError ? (
                  <p className="coach-error">{studentsError}</p>
                ) : students.length === 0 ? (
                  <p className="coach-empty">
                    No students enrolled yet.
                  </p>
                ) : (
                  <div className="coach-students-table-wrapper">

                    <table className="coach-students-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((s, idx) => (
                          <tr key={s.id}>
                            <td>{idx + 1}</td>
                            <td>
                              {`${s.name ?? ""} ${s.surname ?? ""}`.trim() || "—"}
                            </td>
                            <td>{s.email || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                  </div>
                )}

              </div>

              <div className="coach-modal-footer">
                <button
                  className="coach-modal-btn"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}
      </main>

    </div>
  );
}