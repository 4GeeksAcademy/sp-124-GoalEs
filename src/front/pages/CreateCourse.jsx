import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";


export const CreateCourse = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { store } = useGlobalReducer();
  const token = store.token || localStorage.getItem("jwt-token");

  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    cost: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if(!store.isAuthenticated) {
      navigate("/coaches/login");
    }
  },[store.isAuthenticated, navigate])

  const createCourse = async (e) => {
    e.preventDefault();
    
    if (!form.title || !form.description || !form.cost) {
      setError("All fields are required");
      return;
    }
    console.log("BACKEBD_URL:", BACKEND_URL);

    try {
      const res = await fetch(`${BACKEND_URL}/course`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
          ...(token ? {Authorization: `Bearer ${token}`} : {})
         },
        body: JSON.stringify(form)
      });

      console.log("STATUS:", res.status);
      console.log("CONTENT-TYPE:", res.headers.get("content-type"));

      const raw = await res.text();
      console.log("RAW RESPONSE:", raw);

      let data;
try {
  data = JSON.parse(raw);
} catch {
  data = raw;
}
console.log("PARSED:", data);

      

      if (!res.ok) {
        setError(
          typeof data === "string" ? data : 
          data.error || data.msg || "Error creating course"
        );
        return;
      }

      navigate("/coach/private");
    } catch (e) {
      setError("Request failed");
    }
  };

  return (
    <div className="container py-4">
      <h1>Create Course</h1>

      {error && <div className="text-danger mb-3">{error}</div>}

      <form onSubmit={createCourse}>
        <input
          className="form-control mb-2"
          placeholder="Title"
          value={form.title}
          onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
        />

        <textarea
          className="form-control mb-2"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
        />

        <input
          className="form-control mb-3"
          type="number"
          placeholder="Cost"
          value={form.cost}
          onChange={e => setForm(p => ({ ...p, cost: e.target.value }))}
        />

        <button className="btn btn-success">Create</button>
      </form>

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

