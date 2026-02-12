import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";


export default function CoachPrivate() {
    const { store } = useGlobalReducer();
    const { dispatch } = useGlobalReducer();
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [coursesError, setCoursesError] = useState("");

    const token = store.token || localStorage.getItem("jwt-token");

    const handleTestPrivate = async () => { 
        setMsg("");

        try {
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const resp = await fetch(`${backendURL}/coach/private`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + (store.token || localStorage.getItem("jwt-token"))
      }
    });

    const data = await resp.json();

    if (!resp.ok) {
      setMsg(JSON.stringify(data));
      return;
    }

    setMsg("OK: " + JSON.stringify(data));
  } catch (err) {
    setMsg("fetch failed");
  }


    }

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
      const coachId = store.coach?.id;
      const myCourses = coachId
        ? allCourses.filter(c => c.coach_id === coachId)
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


    const handleLogout = () => {
        localStorage.removeItem("jwt-token");

        dispatch({type: "logout" });

        navigate("/");
    };

    return (
        <>
        <div style={{padding: 40}}>
            <h2>Coach Dashboard</h2>

            <p>Coach ID: {store.coach?.id}</p>

            <h4>My courses:</h4>
            {loadingCourses && <p>Loading...</p>}
            {coursesError && <p className="text-danger">{coursesError}</p>}

            {!loadingCourses && !coursesError && courses.length === 0 && (
              <p>You don't have any courses created yet.</p>
            )}

            <ul>
              {courses.map(c => (
                <li key={c.id}>
                  <strong>{c.title}</strong> - €{c.cost}
                  <br />
                  <small>{c.description}</small>
                </li>
              ))}
            </ul>

             <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-primary" onClick={() => navigate("/coach/create-course")}>
          Create Course
        </button>

            <button className="btn btn-primary" onClick={handleLogout}>Log out</button>
            <button className="btn btn-outline-primary ms-2" onClick={handleTestPrivate}>
  Test Private
</button>

{msg && <p>{msg}</p>}
        </div>
        </div>
        
        </>
    );
    };