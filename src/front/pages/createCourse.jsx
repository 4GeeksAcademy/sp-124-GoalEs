import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export const CreateCourse = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    cost: ""
  });
  const [error, setError] = useState("");

  const createCourse = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.cost) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/course`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Error creating course");

      navigate("/courses");
    } catch (e) {
      setError(e.message);
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

