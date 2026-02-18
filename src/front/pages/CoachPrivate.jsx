import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";



export default function CoachPrivate() {
  const { dispatch, store } = useGlobalReducer();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [coursesError, setCoursesError] = useState("");

  const token = localStorage.getItem("token-coach");

 

  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      setCoursesError("");

      try {
        const backendURL = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`${backendURL}/course`);
        const data = await res.json();

        if (!res.ok) {
          setCoursesError(data.error || data.msg || "Erro ao buscar cursos");
          return;
        }
        const allCourses = data.courses || [];
        const coachId = Number(localStorage.getItem("coach_id"))
        const myCourses = coachId
          ? allCourses.filter(c => {
            return c.coach_id === coachId})
          : allCourses;
        setCourses(myCourses);
      } catch (e) {
        setCoursesError("Falha ao buscar cursos");
      } finally {
        setLoadingCourses(false);
      }
    };

    if (store.isAuthenticated || token) fetchCourses();
  }, [store.isAuthenticated, store.coach?.id]);

  const handleDelete = async (courseId) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    if (!window.confirm("Are you sure?")) return;

    const res = await fetch(`${backendURL}/course/${courseId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.ok) {
      setCourses(prev => prev.filter(c => c.id !== courseId));
    } else {
      const data = await res.json();
      alert(data.msg || data.error || "Error to delete");
    }
  };


  const handleLogout = () => {
    localStorage.clear()

    dispatch({ type: "logout-coach" });

    navigate("/");
  };

  return (
    <>
      <div style={{ padding: 40 }}>
        <h2>{store.coach.name} Dashboard</h2>
<button className="btn btn-primary" onClick={() => console.log(courses)}>Ver cursos en consola</button>
        <p>Coach ID: {localStorage.getItem("coach_id")}</p>

        <h4>My courses:</h4>
        {loadingCourses && <p>Loading...</p>}
        {coursesError && <p className="text-danger">{coursesError}</p>}

        {!loadingCourses && !coursesError && courses.length === 0 && (
          <p>You don't have any courses created yet.</p>
        )}

        <ul>
          {courses.map(c => (
            <li key={c.id} style={{ marginBottom: 12 }}>
              <strong>{c.title}</strong> - €{c.cost}
              <br />
              <small>{c.description}</small>
              <br />

              <button
                className="btn btn-danger btn-sm mt-2"
                onClick={() => handleDelete(c.id)}
              >
                Delete
              </button>
              <button className="btn btn-warning btn-sm mt-2 me-2" onClick={() => navigate(`/coach/edit-course/${c.id}`)}>Edit</button>
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-primary" onClick={() => navigate("/coach/create-course")}>
            Create Course
          </button>

          <button className="btn btn-primary" onClick={handleLogout}>Log out</button>
          {msg && <p>{msg}</p>}
        </div>
      </div>

    </>
  );
};