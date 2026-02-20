import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const CreateCourse = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { store } = useGlobalReducer();

  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    cost: "",
    coach_id: store.coach?.id || null
  });
  const [error, setError] = useState("");
  const [coaches, setCoaches] = useState([]); //new  arash

  const token = store.token || localStorage.getItem("token-admin") || localStorage.getItem("token-coach"); //added by arash
  const isAdmin = !!localStorage.getItem("token-admin"); //new arash

  useEffect(() => { //new arash
    if (!isAdmin) return;

    fetch(`${BACKEND_URL}/coach`) //new arash
      .then(res => res.json())
      .then(data => setCoaches(data.coaches || []));
  }, [isAdmin]);

  useEffect(() => {
    if (store.coach?.id) {
      setForm(prev => ({...prev, coach_id: store.coach.id}));
    }
  },[store.coach])

  const createCourse = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.cost) {
      setError("All fields are required");
      return;
    }

    if (isAdmin && !form.coach_id) { //new arash
      setError("Coach not found. Please login again.");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/course`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, //added by arash
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Error creating course");

      if (isAdmin) navigate ("/courses"); //new arash
      else navigate("/coach/private");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="container py-4">
      <h1>Create Course</h1>

      {error && <div className="text-danger mb-3">{error}</div>}

      <form onSubmit={createCourse}>

        <select //new arash
        className="form-select mb-2"
        value={form.coach_id}
        onChange={(e) => setForm(p => ({ ...p, coach_id: e.target.value }))}
        >
          <option value= "">Select coach</option>
          {coaches.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} {c.last_name} (id: {c.id})
            </option>
          ))}
        </select>

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