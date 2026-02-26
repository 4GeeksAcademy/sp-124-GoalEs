import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";



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
    <div style={{ padding: 40 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <img
            src={store.coach?.profile_image || `https://ui-avatars.com/api/?name=${store.coach?.name}`}
            alt="Profile"
            style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }}
          />
          <div>
            <h2 className="mb-0">{store.coach.name} Dashboard</h2>
            <button
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => navigate("/coaches/profile")}
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="d-flex gap-2"><button
          className="btn btn-outline-primary"
          onClick={() => navigate("/coach/appointments/my")}
          type="button">
          Reservations
        </button>
          <button className="btn btn-danger" onClick={deleteAccount}>
            Delete Account
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Log out
          </button>
        </div>

      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>My Courses</h4>
        <button className="btn btn-primary" onClick={() => navigate("/coach/create-course")}>
          + Create Course
        </button>
      </div>

      {loadingCourses && <p>Loading...</p>}
      {coursesError && <p className="text-danger">{coursesError}</p>}

      {!loadingCourses && !coursesError && courses.length === 0 && (
        <p>You don't have any courses created yet.</p>
      )}

      <div className="row">
        {courses.map((course) => (
          <div key={course.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img src={course.image_url || "https://picsum.photos/400/200"} className="card-img-top" alt="course" style={{ height: "25rem", objectFit: "contain" }} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text">{course.description}</p>
                <p className="fw-bold">${course.cost}</p>
                <p className="text-muted mb-1"> Category: {course.category?.name || "—"} </p>
                <p className="text-muted mb-1"> Tags: {course.tags?.map(t => t.name).join(", ") || "—"} </p>

                <button className="btn btn-info btn-sm w-100" onClick={() => openStudentsModal(course)}>
                  👥 View {course.enrolled_students} Students
                </button>

                <div className="mt-auto d-flex gap-2">
                  <button
                    className="btn btn-warning w-100"
                    onClick={() => navigate(`/coach/edit-course/${course.id}`)}
                  >
                    Edit
                  </button>
                  <button className="btn btn-danger w-100" onClick={() => handleDelete(course.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={closeModal}
        >
          <div className="modal-dialog modal-lg" role="document" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Students — {selectedCourse?.title}</h5>
                <button type="button" className="btn-close" onClick={closeModal} />
              </div>

              <div className="modal-body">
                {loadingStudents ? (
                  <p>Loading...</p>
                ) : studentsError ? (
                  <p className="text-danger">{studentsError}</p>
                ) : students.length === 0 ? (
                  <p className="text-muted">No students enrolled yet.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped align-middle">
                      <thead>
                        <tr>
                          <th style={{ width: 60 }}>#</th>
                          <th>Name</th>
                          <th>Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((s, idx) => (
                          <tr key={s.id}>
                            <td>{idx + 1}</td>
                            <td>{`${s.name ?? ""} ${s.surname ?? ""}`.trim() || "—"}</td>
                            <td>{s.email || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}