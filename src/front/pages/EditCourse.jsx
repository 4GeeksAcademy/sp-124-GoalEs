import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";


export const EditCourse = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { store } = useGlobalReducer();
  const token = store.token || localStorage.getItem("jwt-token");

  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    cost: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCourse = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/course/${id}`);
      if (!res.ok) throw new Error("Error loading course");

      const data = await res.json();
      const course = data.course ?? data;

      setForm({
        title: course.title,
        description: course.description,
        cost: course.cost
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/coaches/login");
      return;
    }
    fetchCourse();
  }, [id]);

  const updateCourse = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${BACKEND_URL}/course/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
         },
        body: JSON.stringify(form)
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error("Error updating course");

      navigate("/coach/private");
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <p className="container py-4">Loading...</p>;
  if (error) return <p className="container py-4 text-danger">{error}</p>;

  return (
    <div className="container py-4">
      <h1>Edit Course #{id}</h1>

      <form onSubmit={updateCourse}>
        <input
          className="form-control mb-2"
          value={form.title}
          onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
        />

        <textarea
          className="form-control mb-2"
          value={form.description}
          onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
        />

        <input
          className="form-control mb-3"
          type="number"
          value={form.cost}
          max={999999999}
          onChange={e => setForm(p => ({ ...p, cost: e.target.value }))}
        />

        <button className="btn btn-primary">Save</button>
      </form>

      <div className="mt-4 d-flex gap-2">
        <button className="btn btn-secondary" onClick={() => navigate("/courses")}>
          Back
        </button>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>
          Home
        </button>
      </div>
    </div>
  );
};

